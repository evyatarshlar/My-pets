import { Component, Signal, effect, inject } from '@angular/core';
import { MsgService } from '../../services/msg.service';
import { Observable } from 'rxjs';
import { Msg } from '../../models/msg.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'msg-cmp',
    imports: [],
    templateUrl: './msg.component.html',
    styleUrl: './msg.component.scss'
})
export class MsgComponent {
    private msgService = inject(MsgService)

    effectRef = effect(() => {
        console.log(this.msg_(), 'msg_');

    })


    msg_: Signal<Msg | null> = toSignal(this.msgService.msg$, { requireSync: true })

   
    onCloseMsg() {
        this.msgService.closeMsg()
    }
}
