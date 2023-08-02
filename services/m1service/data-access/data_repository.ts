import { DataModel } from './data_model.js'

export abstract class DataRepository<OutRecord> {
  constructor(
    private model: DataModel<OutRecord>
  ) { }

  findById(id: number): Promise<OutRecord> {
    return this.model.findById(id)
  }
}
