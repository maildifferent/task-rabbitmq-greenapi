import { DataSource } from './data_source.js'

export abstract class DataModel<OutRecord> {
  constructor(
    private target: string,
    private dataSource: DataSource
  ) { }

  abstract typeguard(obj: unknown): obj is OutRecord

  async findById(id: number): Promise<OutRecord> {
    const obj: unknown = await this.dataSource.findById(this.target, id)
    if (!this.typeguard(obj))
      throw new Error('Incorrect obj returned from source: ' + JSON.stringify(obj))
    return obj
  }
}
