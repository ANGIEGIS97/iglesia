import { onBeforeUnmount, watch, type Ref } from "vue";

let lockCount = 0;

function applyLock() {
  document.body.style.overflow = "hidden";
  document.body.classList.add("modal-open");
}

function releaseLock() {
  document.body.style.overflow = "";
  document.body.classList.remove("modal-open");
}

export function useBodyScrollLock(isLocked: Ref<boolean>) {
  let owns = false;

  function acquire() {
    if (owns) return;
    owns = true;
    lockCount++;
    if (lockCount === 1) applyLock();
  }

  function release() {
    if (!owns) return;
    owns = false;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) releaseLock();
  }

  watch(
    isLocked,
    (locked) => {
      if (locked) acquire();
      else release();
    },
    { immediate: true },
  );

  onBeforeUnmount(release);
}
