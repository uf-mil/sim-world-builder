import { memo } from 'react';

export const Prop = memo(({ prop, onMouseDown, onRemoveProp, isSelected, isMoving, style }) => {
    // Create var for classes for cleaner code
    const classes = `
        select-none absolute rounded-lg shadow-xl 
        flex items-center justify-center font-semibold text-white 
        group bg-indigo-600 w-20 h-20 p-2 text-xs hover:bg-indigo-700
        ${(isSelected || isMoving) ? 'z-50 border-4 border-yellow-400' : 'z-10 cursor-pointer'}
        ${isMoving ? 'opacity-75 border-dashed cursor-grabbing' : ''}
        ${isSelected && !isMoving ? 'cursor-grab' : ''}
    `;

    return (
        <div
            className={classes}
            style={style}
            onMouseDown={onMouseDown}
        >
            {/* Temporarily displays prop's type name */}
            {/* NEED TO REPLACE WITH PROPER ICON */}
            {prop.type}

            {/* Delete button (Red 'x' in top right) */}
            <button
                onClick={() => onRemoveProp(prop.id)}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute -top-2 -right-2 bg-red-600 p-1 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 shadow-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                style={{ width: '20px', height: '20px', lineHeight: '10px' }}
                title="Remove Prop"
            >
                ×
            </button>
        </div>
    );
});