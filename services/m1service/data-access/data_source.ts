
export abstract class DataSource {
  abstract findById(target: string, id: number): Promise<unknown>
}
