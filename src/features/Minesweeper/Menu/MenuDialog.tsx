import { forwardRef, useEffect, useState } from 'react';
import { Difficulty } from '../types';

import styles from './Menu.module.css';

interface MenuDialogProps {
  difficulty: Difficulty;
  onSubmit: (difficulty: Difficulty) => void;
}

export const MenuDialog = forwardRef<HTMLDialogElement, MenuDialogProps>(
  function MenuDialog({ difficulty, onSubmit }, ref) {
    const [state, setState] = useState(difficulty);

    useEffect(() => {
      setState(difficulty);
    }, [difficulty]);

    function handleSubmit() {
      //TODO:fix ts
      ref?.current?.close();
      onSubmit(state);
    }
    return (
      <dialog className={styles.dialog} open={false} ref={ref}>
        <form method="dialog" onSubmit={handleSubmit}>
          <div className={styles['form-inputs']}>
            <label htmlFor="width">Width: </label>
            <input
              id="width"
              type="number"
              value={state.width}
              onChange={(e) =>
                setState({ ...state, width: Number(e.target.value) })
              }
              min={9}
            />
            <label htmlFor="height">Height: </label>
            <input
              id="height"
              type="number"
              value={state.height}
              onChange={(e) =>
                setState({ ...state, height: Number(e.target.value) })
              }
              max={99}
            />
            <label htmlFor="mines">Mines: </label>
            <input
              id="mines"
              type="number"
              value={state.minesCount}
              onChange={(e) =>
                setState({ ...state, minesCount: Number(e.target.value) })
              }
              min={2}
              max={state.width * state.height - 2}
            />
          </div>
          <div className={styles['form-buttons']}>
            <button>OK</button>
            <button type="button" onClick={() => ref?.current?.close()}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    );
  }
);
