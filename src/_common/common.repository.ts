/* eslint-disable */
export class CommonRepository<
    Delegate extends {
        create: (...args: any) => any;
        createMany: (...args: any) => any;
        createManyAndReturn: (...args: any) => any;
        update: (...args: any) => any;
        updateMany: (...args: any) => any;
        updateManyAndReturn: (...args: any) => any;
        delete: (...args: any) => any;
        deleteMany: (...args: any) => any;
        findUnique: (...args: any) => any;
        findUniqueOrThrow: (...args: any) => any;
        findFirst: (...args: any) => any;
        findFirstOrThrow: (...args: any) => any;
        findMany: (...args: any) => any;
        aggregate: (...args: any) => any;
        groupBy: (...args: any) => any;
        count: (...args: any) => any;
    },
> {
    constructor(protected readonly model: any) {
        this.create = model.create.bind(model);
        this.createMany = model.createMany.bind(model);
        this.createManyAndReturn = model.createManyAndReturn.bind(model);
        this.update = model.update.bind(model);
        this.updateMany = model.updateMany.bind(model);
        this.updateManyAndReturn = model.updateManyAndReturn.bind(model);
        this.delete = model.delete.bind(model);
        this.deleteMany = model.deleteMany.bind(model);
        this.findUnique = model.findUnique.bind(model);
        this.findUniqueOrThrow = model.findUniqueOrThrow.bind(model);
        this.findFirst = model.findFirst.bind(model);
        this.findFirstOrThrow = model.findFirstOrThrow.bind(model);
        this.findMany = model.findMany.bind(model);
        this.aggregate = model.aggregate.bind(model);
        this.groupBy = model.groupBy.bind(model);
        this.count = model.count.bind(model);
    }

    public create!: Delegate['create'];
    public createMany!: Delegate['createMany'];
    public createManyAndReturn!: Delegate['createManyAndReturn'];
    public update!: Delegate['update'];
    public updateMany!: Delegate['updateMany'];
    public updateManyAndReturn!: Delegate['updateManyAndReturn'];
    public delete!: Delegate['delete'];
    public deleteMany!: Delegate['deleteMany'];
    public findUnique!: Delegate['findUnique'];
    public findUniqueOrThrow!: Delegate['findUniqueOrThrow'];
    public findFirst!: Delegate['findFirst'];
    public findFirstOrThrow!: Delegate['findFirstOrThrow'];
    public findMany!: Delegate['findMany'];
    public aggregate!: Delegate['aggregate'];
    public groupBy!: Delegate['groupBy'];
    public count!: Delegate['count'];
}
