// hooks/useModal.ts
import { atom, useRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';


export const modalStackState = atom<string[]>({
  key: 'modalStackState',
  default: [],
});



export const useModal = () => {
  const [modalStack, setModalStack] = useRecoilState(modalStackState);

  const openModal = useCallback((modalId: string) => {
    setModalStack((prevStack) => [...prevStack, modalId]);

    window.history.pushState({ modalId }, '', '');
  }, [setModalStack]);

  console.log('modalStack', modalStack);
  const closeModal = useCallback(() => {
    setModalStack((prevStack) => {
      const newStack = [...prevStack];
      newStack.pop(); // Remove the top modal
      const previousModalId = newStack[newStack.length - 1];
      window.history.pushState({ modalId: previousModalId || 'root' }, '', '');
      return newStack;
    });
  }, [setModalStack]);

  const handlePopstate = useCallback((event: PopStateEvent) => {
    if (event.state?.modalId) {
      setModalStack((prevStack) => {
        const newStack = [...prevStack];
        while (newStack.length && newStack[newStack.length - 1] !== event.state.modalId) {
          newStack.pop();
        }
        return newStack;
      });
    } else {
      // If no modalId is present, close all modals (typically this happens when the user navigates back to the root state)
      setModalStack([]);
    }
  }, [setModalStack]);

  useEffect(() => {
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [handlePopstate]);

  return {
    openModal,
    closeModal,
    modalStack,
  };
};
