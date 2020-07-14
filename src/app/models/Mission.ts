export class Mission {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public startDate: Date,
        public finishDate: Date,
        public fileDb: File
    ) { }
}