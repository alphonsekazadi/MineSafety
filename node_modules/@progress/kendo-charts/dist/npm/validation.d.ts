export interface ValidationSuccess {
    valid: true;
}
export interface ValidationError {
    valid: false;
    error: Error;
}

export type ValidationResult = ValidationError | ValidationSuccess;
