import { memo } from 'react';

export const Prop = memo(({ prop, onMouseDown, onRemoveProp, isSelected, isMoving }) => {
    return (
        <div
            className={`
                ${isSelected ? `z-50 border-4 border-yellow-400 cursor-grab` : `cursor-pointer z-10`}
                ${isMoving ? 'opacity-75 z-50 border-4 border-yellow-400 border-dashed cursor-grabbing' : 'z-10'} 
                select-none absolute rounded-lg shadow-xl transition-all duration-300 flex items-center justify-center font-semibold text-white group bg-indigo-600 w-20 h-20 p-2 text-xs hover:bg-indigo-700
            `}
            style={{ left: `${prop.x}px`, top: `${prop.y}px` }}
            onMouseDown={(e) => onMouseDown(e, prop)}
        >
            {prop.type} (ID: {prop.id})

            {/* Red X to remove prop */}
            <button
                onClick={() => onRemoveProp(prop.id)}

                // Prevents moving prop once the delete button is pressed
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute -top-2 -right-2 bg-red-600 p-1 text-white rounded-full text-cs opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                style={{ width: '20px', height: '20px', lineHeight: '10px' }}
                title="Remove Prop"
            >
                x
            </button>
        </div >
    );
});