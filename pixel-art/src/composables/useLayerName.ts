import { computed, ref, nextTick } from "vue";
import { useDoState } from "./useDoState";
import { useStore } from "./useStore";
export function useLayerName() {
  const store: any = useStore();
  const { toUndoStack, TYPE } = useDoState();
  const renameIndex = ref(-1);
  const renameElement = ref(null);
  const tempName = ref("");
  function changeLayerName(event: any) {
    const { currentPageIndex } = store.state.canvasModule;
    store.state.canvasModule.pages[currentPageIndex].layers[
      renameIndex.value
    ].layerName = event.target.value;
  }
  function rename(index: number) {
    console.log("rename", index);
    renameIndex.value = index;
    nextTick(() => {
      if (renameElement.value) {
        (renameElement.value as any).focus();
      }
    });
  }
  function blurInput() {
    if (renameElement.value) {
      (renameElement.value as any).blur();
    }
  }
  function renameStart() {
    console.log(renameIndex.value);
    const { currentPageIndex } = store.state.canvasModule;
    tempName.value =
      store.state.canvasModule.pages[currentPageIndex].layers[
        renameIndex.value
      ].layerName;
  }
  function renameFinish() {
    const { currentPageIndex, currentLayerIndex } = store.state.canvasModule;
    const fininaName =
      store.state.canvasModule.pages[currentPageIndex].layers[renameIndex.value]
        .layerName;
    const startName = tempName.value;
    if (startName !== fininaName) {
      toUndoStack(
        {
          currentLayerIndex,
          currentPageIndex,
          layerName: startName,
          type:TYPE.LAYER_RENAME
        },
        true
      );
    }
    renameIndex.value = -1;
  }
  return {
    changeLayerName,
    renameStart,
    renameFinish,
    blurInput,
    renameIndex,
    renameElement,
    rename
  };
}
