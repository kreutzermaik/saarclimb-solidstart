import {createSignal, onMount, onCleanup} from "solid-js";

type NumberAnimationProps = {
    targetValue: number
}

export default function NumberAnimation(props: NumberAnimationProps) {

    const [currentValue, setCurrentValue] = createSignal(0);

    onMount(() => {
        const animationDuration = 2000; // Dauer der Animation in Millisekunden
        const updateInterval = 20; // Aktualisierungsintervall in Millisekunden
        const steps = Math.ceil(animationDuration / updateInterval);
        const stepValue = props.targetValue / steps;

        let step = 0;

        const animationInterval = setInterval(() => {
            setCurrentValue(prevValue => prevValue + stepValue);
            step++;

            if (step >= steps) {
                setCurrentValue(props.targetValue);
                clearInterval(animationInterval);
            }
        }, updateInterval);

        onCleanup(() => {
            clearInterval(animationInterval); // Reinige das Intervall, wenn die Komponente zerstört wird
        });
    });

    return (
        <div class="number text-[24px] font-bold">{Math.round(currentValue())}</div>
    )
}
