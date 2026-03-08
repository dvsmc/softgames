import { render } from "preact";
import { useCallback, useState } from "preact/hooks";
import menuBackgroundWebpUrl from "/assets/menuBackground.webp?url";
import { DEMOS } from "../consts";
import type { DemoId } from "../types";
import { getKeys } from "../utils/getKeys";
import classes from "./Ui.module.css";

type UiProps = {
    onSelectDemo: (id: DemoId) => void;
    onBack: () => void;
};

function Ui({ onSelectDemo, onBack }: UiProps) {
    const [menuVisible, setMenuVisible] = useState(true);

    const selectDemo = useCallback(
        (id: DemoId) => {
            onSelectDemo(id);
            setMenuVisible(false);
        },
        [onSelectDemo],
    );

    const goToMenu = useCallback(() => {
        setMenuVisible(true);
        onBack();
    }, [onBack]);

    return (
        <>
            {menuVisible ? (
                <aside className={classes.menu} style={{ backgroundImage: `url(${menuBackgroundWebpUrl})` }}>
                    <h1 className={classes.title}>Softgames Assignment</h1>
                    <p className={classes.subtitle}>Pick a demo:</p>
                    <div className={classes.list}>
                        {getKeys(DEMOS).map((id) => (
                            <button key={id} type="button" className={classes.item} onClick={() => selectDemo(id)}>
                                <span className={classes.itemTitle}>{DEMOS[id]}</span>
                            </button>
                        ))}
                    </div>
                </aside>
            ) : (
                <button type="button" className={classes.backButton} onClick={goToMenu}>
                    Back
                </button>
            )}
        </>
    );
}

export function createUi(target: Element, onSelectDemo: (id: DemoId) => void, onBack: () => void): () => void {
    render(<Ui onSelectDemo={onSelectDemo} onBack={onBack} />, target);

    return () => render(null, target);
}
