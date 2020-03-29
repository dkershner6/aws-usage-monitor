export enum CostCantBe {
    ABOVE_ZERO = 'ABOVE_ZERO',
}

export interface IConfig {
    costCantBe: CostCantBe;
}

export const CONFIG: IConfig = {
    costCantBe: CostCantBe.ABOVE_ZERO,
};

export default CONFIG;
