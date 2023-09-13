export class User {
    firstName: string;
    lastName: string;
    job: string;
    email: string;
    phone: string;
    address: string;
    zipCode: number;
    city: string;
    id: string;

    constructor(obj?: any) {
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.job = obj ? obj.job : '';
        this.email = obj ? obj.email : '';
        this.phone = obj ? obj.phone : '';
        this.address = obj ? obj.address : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.id = obj ? obj.id : '';
    }


    public toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            job: this.job,
            email: this.email,
            phone: this.phone,
            address: this.address,
            zipCode: this.zipCode,
            city: this.city,
            id: this.id
        }
    }
}