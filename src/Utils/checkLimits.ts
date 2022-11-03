import { Point } from "../types/Point";

export const checkXLimits = (position: Point): boolean => {
    if (position.x <= 1400 && position.x >= 0) {
        return true;
    }
    return false;
};

export const checkYLimits = (position: Point): boolean => {
    if (position.y <= 1500 && position.y >=-50) {
        return true;
    }
    return false;
};