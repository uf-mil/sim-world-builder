function PropToggleButton({ label, index, enabledStates, setEnabledStates }: { label: string, index: number, enabledStates: Array<boolean>, setEnabledStates: any }) {
    function toggleEnable() {
        setEnabledStates((prev) => {
            const newEnabledStates = [...prev];
            newEnabledStates[index] = !newEnabledStates[index];

            return newEnabledStates;
        });
    }

    return (
        <button className="w-30 h-30 m-2"
            onClick={toggleEnable}
        >
            {label}
            {enabledStates[index] ?
                <p className="text-green-700">Enabled</p>
                :
                <p className="text-red-700">Disabled</p>
            }
        </button>
    )
}
export default PropToggleButton;