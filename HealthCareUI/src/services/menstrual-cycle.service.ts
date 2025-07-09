import { MenstrualCycle } from './../app/feature/client/menstrual-cycle/created-menstrual-cycle/created-menstrual-cycle.component';
import { Injectable } from "@angular/core";
import { environment } from "../app/app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';

export interface MenstrualCycleDTO {
    accountID: string;
    start_date: string;
    end_date: string;
    reminder_enabled: number;
    note: string;
}
@Injectable({
    providedIn: 'root'
})
export class MenstrualService {
    private apiUrl = environment.apiUrl + '/api/MenstrualCycle'; // Đổi thành API thực tế của cậu

    constructor(private http: HttpClient) { }

    getCycleByAccId(id: string): Observable<MenstrualCycleDTO[]> {
        return this.http.get<MenstrualCycleDTO[]>(`${this.apiUrl}/menstrual-cycle-by-account-id/${id}`);
    }
    createCycle(cycle: MenstrualCycleDTO): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-menstrual-cycle`, cycle);
    }


}