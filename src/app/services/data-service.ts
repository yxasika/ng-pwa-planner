import {Schema} from '../types/schema';
import {BehaviorSubject, concat, from, merge, Observable} from 'rxjs';
import {debounceTime, filter} from 'rxjs/operators';
import {DataStore} from './store/data-store';

export abstract class DataService<DTO, SCHEMA extends DTO & Schema> {

  /**
   * The main data representation of the data service is managed as a behaviorSubject.
   */
  private readonly observedData: BehaviorSubject<SCHEMA[]> = new BehaviorSubject<SCHEMA[]>([]);

  /**
   * the list of stores the data will be loaded from incl. the priority.
   */
  private readonly dataStoreList: { priority: number, store: DataStore<DTO, SCHEMA> }[] = [];

  protected constructor(opts?: { stores: { priority: number, store: DataStore<DTO, SCHEMA> }[] }) {
    const stores = (opts && opts.stores) || [];
    this.attachStore(...stores);
  }

  /**
   * Current data representation in plain typescript object notation.
   */
  get data(): SCHEMA[] {
    return this.observedData.value;
  }

  /**
   * Wrapper for setting new data over the subject api. If data is overwritten, change-observers will be notified.
   * The id of each element will be newly reset at update to enable DTO prototypes as being set and casted.
   * @param data the data to overwrite.
   */
  set data(data: SCHEMA[]) {
    const schemaData: SCHEMA[] = [];
    for (let i = 0; i < data.length; i++) {
      schemaData[i] = {...data[i]} as SCHEMA;
      schemaData[i].id = schemaData[i].id || i;
    }
    this.observedData.next(schemaData);
    this.setAll(schemaData);
  }

  /**
   * Retrieves a stream of the current data and updates if data is updated or overwritten.
   */
  get dataAsObservable$(): Observable<SCHEMA[]> {
    return this.observedData.asObservable();
  }

  /**
   * Entry point function to load all of the stored data over all available and attached data stores in a data pipe. Higher prioritized
   * stores will overwrite the loaded data of a lesser one, if the data is not null.
   */
  public loadDataFromStores(): Observable<SCHEMA[]> {
    const loadingObservables = this.dataStoreList.map(storeItem => from(storeItem.store.load()));
    const connectedObservables = concat(...loadingObservables).pipe(
      filter(d => !!d && !!d.length),
    );
    connectedObservables.subscribe((data: SCHEMA[]) => this.observedData.next(data));
    return connectedObservables;
  }

  /**
   * Setter Method to overwrite the data on each store with the provided data.
   * @param data the data to overwrite current data.
   */
  setAll(data: DTO[]): void {
    const savingObservables = this.dataStoreList.map(storeItem => from(storeItem.store.setItems(data)));
    merge(...savingObservables).pipe(debounceTime(2000)).subscribe(_ => this.loadDataFromStores());
  }

  /**
   * Setter Method to set a new data item on the store's model.
   * @param data the data to be set.
   */
  setItem(data: DTO): void {
    const savingObservables = this.dataStoreList.map(storeItem => from(storeItem.store.setItem(data)));
    merge(...savingObservables).pipe(debounceTime(2000)).subscribe(_ => this.loadDataFromStores());
  }

  /**
   * Update Method to overwrite the item at given index on the store's model.
   * @param id the index to be chosen.
   * @param data the data to overwrite the current item.
   */
  patchItem(id: number, data: DTO) {
    const savingObservables = this.dataStoreList.map(storeItem => from(storeItem.store.patchItem(id, data)));
    merge(...savingObservables).pipe(debounceTime(2000)).subscribe(_ => this.loadDataFromStores());
  }

  /**
   * Attaches a new data store in the data pipe. The newly connected store will be called according to its set priority. If other stores
   * have the same priority, the new store will be called before.
   * @param storeItems the stores to be added in the data pipe.
   */
  protected attachStore(...storeItems: { priority: number, store: DataStore<DTO, SCHEMA> }[]) {
    for (const storeItem of storeItems) {
      const nextQueuedItemIndex = this.dataStoreList.findIndex(dataStore => dataStore.priority >= storeItem.priority);
      const insertIndex = nextQueuedItemIndex === -1 ? this.dataStoreList.length : nextQueuedItemIndex;
      this.dataStoreList.splice(insertIndex, 0, storeItem);
    }
  }

}
