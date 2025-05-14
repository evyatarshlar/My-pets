import { ModuleWithProviders } from "@angular/core";
import { SetDisabledStateOption } from "@angular/forms";

class FormsModule {
    static withConfig(opts: { callSetDisabledState?: SetDisabledStateOption; }): ModuleWithProviders<FormsModule>;
}