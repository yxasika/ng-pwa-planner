import {Schema} from '../../types/schema';

/**
 * The abstract store implementation.
 */
export abstract class DataStore<DTO, SCHEMA extends DTO & Schema> {

  /**
   * load the data representation of the connected model and delegate the retreived data.
   */
  abstract load(): Promise<SCHEMA[]>;

  /**
   * All of the current stored data will be wiped and overwritten with the parameter data.
   * @param data the data representation to overwrite the current state.
   */
  abstract setItems(data: DTO[] | SCHEMA[]): Promise<any>;

  /**
   * Sets a new data item in the data store.
   * @param data the data item to be set.
   */
  abstract setItem(data: DTO): Promise<any>;

  /**
   * Updates the data item at given index with the given data item.
   * @param id the index of the data item to be updated.
   * @param data the data to overwrite the current item.
   */
  abstract patchItem(id: number, data: DTO): Promise<any>;

}
