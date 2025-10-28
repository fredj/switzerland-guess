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
        if (dialog.open !== this.open) {
          dialog.open = this.open;
        }
      }
    }
    protected firstUpdated(): void {
      this.firstElementChild?.addEventListener("wa-hide", (originalEvent) => {
        // FIXME: on close, the element should not do a new render cycle
        this.open = false;
        this.dispatchEvent(new CustomEvent("close"));
      });
      this.firstElementChild?.addEventListener("wa-show", (originalEvent) => {
        this.open = true;
        this.dispatchEvent(new CustomEvent("open"));});
    }
  }
  return ClosableElement as Constructor<ClosableInterface> & T;
};
