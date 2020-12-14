import {DataStore} from './data-store';
import * as localforage from 'localforage';
import {Plan, PlanSchema} from '../../types/plan';

/**
 * DataStore Implementation of as an LocalForage wrapper class. LocalForage itself will use indexedDB and handle different browser store
 * techniques as fallback.
 */
export class LocalforageDataStore extends DataStore<Plan, PlanSchema> {
  private readonly keyPrefix: string = '';

  async load(): Promise<PlanSchema[]> {
    const keys = await localforage.keys();
    const plans: PlanSchema[] = [];

    for (const key of keys) {
      const plan: PlanSchema = await localforage.getItem(key);
      plans.push({...plan, id: +key.replace(this.keyPrefix, '')});
    }
    return [...plans.filter(p => !!p)];
  }

  async setItems(data: Plan[] | PlanSchema[]): Promise<any> {
    for (let key = 0; key < data.length; key++) {
      await localforage.setItem(this.keyPrefix + key, data[key]);
    }
    return (await localforage.keys()).length;
  }

  async setItem(data: Plan): Promise<any> {
    const keys = await localforage.keys();
    const numKeys = keys.map(key => +key.replace(this.keyPrefix, ''));
    const maxKey = Math.max(...numKeys);
    const chosenKey = !isNaN(maxKey) && maxKey >= 0 ? maxKey + 1 : numKeys.length;
    await localforage.setItem(this.keyPrefix + chosenKey, data);
    return chosenKey;
  }

  async patchItem(key: number, data: Plan): Promise<any> {
    const updatedValue = await localforage.setItem(this.keyPrefix + key, data);
    return !!updatedValue ? 1 : 0;
  }

}
