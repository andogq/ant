export const rotation_changes = [-90, 0, 90] as const;
export type RotationChange = (typeof rotation_changes)[number];

export const rotations = ["U", "R", "D", "L"] as const;
export type Rotation = (typeof rotations)[number];

export function apply_rotation(rotation: Rotation, change: RotationChange): Rotation {
    let di;

    if (change === 90) {
        // Turning left
        di = -1;
    } else if (change === -90) {
        // Turning right
        di = 1;
    } else if (change === 0) {
        // Straight
        di = 0;
    } else {
        console.error("Unknown change", change);
        return rotation;
    }

    // Rotate rotations with wrapping
    let current_index = rotations.indexOf(rotation);
    let index = (rotations.length + current_index + di) % rotations.length;

    return rotations[index];
}
