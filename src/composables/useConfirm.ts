import { reactive } from "vue";

interface ConfirmOptions {
  danger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmState {
  open: boolean;
  message: string;
  danger: boolean;
  confirmLabel: string;
  cancelLabel: string;
}

// Singleton a nivel de módulo — compartido entre todos los islands de Vue en la misma página
const _state = reactive<ConfirmState>({
  open: false,
  message: "",
  danger: false,
  confirmLabel: "Aceptar",
  cancelLabel: "Cancelar",
});

let _resolve: ((result: boolean) => void) | null = null;

export function useConfirm() {
  function confirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
    _state.open = true;
    _state.message = message;
    _state.danger = options.danger ?? false;
    _state.confirmLabel = options.confirmLabel ?? "Aceptar";
    _state.cancelLabel = options.cancelLabel ?? "Cancelar";

    return new Promise<boolean>((resolve) => {
      _resolve = resolve;
    });
  }

  function _accept() {
    _state.open = false;
    _resolve?.(true);
    _resolve = null;
  }

  function _cancel() {
    _state.open = false;
    _resolve?.(false);
    _resolve = null;
  }

  return { confirm, confirmState: _state, _accept, _cancel };
}
