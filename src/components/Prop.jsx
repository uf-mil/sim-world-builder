import { memo } from 'react';

export const Prop = memo(({ prop, onMouseDown, onRemoveProp, isMoving }) => {
    return (
        <div
            className={`
          ${isMoving ? 'opacity-75 z-50 ring-4 ring-yellow-400 cursor-grabbing' : 'z-10'} 
        select-none absolute rounded-lg shadow-xl cursor-grab transition-all duration-300 flex items-center justify-center font-semibold text-white group bg-indigo-600 w-20 h-20 p-2 text-xs hover:bg-indigo-700`}
            style={{ left: `${prop.x}px`, top: `${prop.y}px` }}
            onMouseDown={(e) => onMouseDown(e, prop.id)}
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