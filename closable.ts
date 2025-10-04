import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import type WaDialog from "@awesome.me/webawesome/dist/components/dialog/dialog";

type Constructor<T> = new (...args: any[]) => T;

export declare class ClosableInterface {
  open: boolean;
}

// Mixin to add open property and open/close events to a LitElement wrapping a wa-dialog
export const Closable = <T extends Constructor<LitElement>>(superClass: T) => {
  class ClosableElement extends superClass {
    @property({ type: Boolean, reflect: true }) open = false;

    protected updated(changedProperties: PropertyValues): void {
      if (changedProperties.has("open")) {
        const dialog = this.firstElementChild as WaDialog;
        dialog.open = this.open;
        this.dispatchEvent(new CustomEvent(this.open ? "open" : "close"));
      }
    }
    protected firstUpdated(): void {
      this.firstElementChild?.addEventListener("wa-hide", () => {
        this.open = false;
      });
      this.firstElementChild?.addEventListener("wa-show", () => {
        this.open = true;
      });
    }
  }
  return ClosableElement as Constructor<ClosableInterface> & T;
};
