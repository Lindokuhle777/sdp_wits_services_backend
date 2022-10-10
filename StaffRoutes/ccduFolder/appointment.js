export class Appointment {
    constructor(id, counsellor, counsellorName, creator, date, description, loaction, status, time){
        this.id = id;
        this.counsellor = counsellor;
        this.counsellorName = counsellorName;
        this.creator = creator;
        this.date = date;
        this.description = description;
        this.location = loaction
        this.status = status;
        this.time = time;
    }
}