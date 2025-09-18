import {
    TRENDLINE_EXPONENTIAL,
    TRENDLINE_LINEAR,
    TRENDLINE_LOGARITHMIC,
    TRENDLINE_MOVING_AVERAGE,
    TRENDLINE_POLYNOMIAL,
    TRENDLINE_POWER
} from '../constants';
import exponentialTrendline from './exponential-trendline';
import linearTrendline from './linear-trendline';
import logarithmicTrendline from './logarithmic-trendline';
import movingAverageTrendline from './moving-average';
import polynomialTrendline from './polynomial-trendline';
import powerTrendline from './power-trendline';

const registry = {};
registry[TRENDLINE_EXPONENTIAL] = exponentialTrendline;
registry[TRENDLINE_LINEAR] = linearTrendline;
registry[TRENDLINE_LOGARITHMIC] = logarithmicTrendline;
registry[TRENDLINE_MOVING_AVERAGE] = movingAverageTrendline;
registry[TRENDLINE_POLYNOMIAL] = polynomialTrendline;
registry[TRENDLINE_POWER] = powerTrendline;

export default registry;
