import {
    TRENDLINE_EXPONENTIAL,
    TRENDLINE_LINEAR,
    TRENDLINE_LOGARITHMIC,
    TRENDLINE_MOVING_AVERAGE,
    TRENDLINE_POLYNOMIAL,
    TRENDLINE_POWER
} from '../constants';
import scatterExponentialTrendline from './scatter-exponential-trendline';
import scatterLinearTrendline from './scatter-linear-trendline';
import scatterLogarithmicTrendline from './scatter-logarithmic-trendline';
import scatterMovingAverageTrendline from './scatter-moving-average';
import scatterPolynomialTrendline from './scatter-polynomial-trendline';
import scatterPowerTrendline from './scatter-power-trendline';

const scatterRegistry = {};
scatterRegistry[TRENDLINE_EXPONENTIAL] = scatterExponentialTrendline;
scatterRegistry[TRENDLINE_LINEAR] = scatterLinearTrendline;
scatterRegistry[TRENDLINE_LOGARITHMIC] = scatterLogarithmicTrendline;
scatterRegistry[TRENDLINE_MOVING_AVERAGE] = scatterMovingAverageTrendline;
scatterRegistry[TRENDLINE_POLYNOMIAL] = scatterPolynomialTrendline;
scatterRegistry[TRENDLINE_POWER] = scatterPowerTrendline;

export default scatterRegistry;
