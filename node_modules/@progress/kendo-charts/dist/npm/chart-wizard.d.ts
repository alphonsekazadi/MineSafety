import { Margin } from './field-types/margin.interface';

/**
 * Describes a single data cell for the ChartWizard.
 */
export interface ChartWizardDataCell {
    /**
     * The field name of the data cell.
     */
    field: string;

    /**
     * The value of the data cell.
     */
    value: any;
}

/**
 * Describes a data row for the ChartWizard.
 */
export type ChartWizardDataRow = ChartWizardDataCell[];

/**
 * Represents a data column from a grid component or similar.
 */
export interface DataColumn {
    /**
     * The field name of the column.
     */
    field: string;

    /**
     * The title of the column.
     */
    title: string;
}

/**
 * Represents a data row from a grid component or similar.
 */
export interface DataRow {
    /**
     * The data item of the row.
     */
    dataItem: any;
    /**
     * The data cells of the row.
     */
    dataColumns: DataColumn[];
}

/**
 * Represents the series type of the ChartWizard component.
*/
export type ChartWizardSeriesType = 'bar' | 'column' | 'line' | 'pie' | 'scatter';

interface FontInterface {
    /**
     * The font configuration.
     */
    font?: string;
    /**
     * The font color.
     */
    color?: string;
}

/**
 * Represents the configuration of the ChartWizard title.
 */
export interface ChartWizardTitle extends FontInterface {
    /**
     * The text of the title.
     */
    text?: string;
}

/**
 * Represents the configuration of the ChartWizard series stack.
 */
export interface ChartWizardSeriesStack {
    /**
     * The type of the series stack.
     */
    type?: 'normal' | '100%';
}

/**
 * Represents the configuration of the ChartWizard area.
 */
export interface ChartWizardArea {
    /**
     * The background color of the area.
     */
    background?: string;
    /**
     * The margin of the area.
     */
    margin?: Margin;
}

/**
 * Represents the configuration of the ChartWizard axis label.
 */
export interface ChartWizardAxisLabel extends FontInterface {
    /**
     * The rotation of the labels.
     */
    rotation?: number | 'auto';

    /**
     * The format of the labels.
     */
    format?: string;
}

interface ChartAxisItem {
    /**
     * The title of the axis.
     */
    title?: ChartWizardTitle;
    /**
     * The labels of the axis.
     */
    labels?: ChartWizardAxisLabel;
    /**
     * The reverse option of the axis.
     */
    reverse?: boolean;
}

/**
 * Represents the configuration of the ChartWizard category axis item.
 */
export interface ChartWizardCategoryAxisItem extends ChartAxisItem {
    /**
     * The categories of the axis.
     */
    categories?: any[];
}

/**
 * Represents the configuration of the ChartWizard value axis item.
 */
export interface ChartWizardValueAxisItem extends ChartAxisItem { }

/**
 * Represents the configuration of the ChartWizard legend.
 */
export interface ChartWizardLegend {
    /**
     * The visibility of the legend.
     */
    visible?: boolean;
    /**
     * The position of the legend.
     */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * The labels of the legend.
     */
    labels?: FontInterface;
}

/**
 * Represents the configuration of the ChartWizard series item label.
 */
export interface ChartWizardSeriesItemLabel {
    /**
     * The visibility of the labels.
     */
    visible?: boolean;
}

/**
 * Represents the configuration of the ChartWizard series item.
 */
export interface ChartWizardSeriesItem {
    /**
     * The id of the series item.
     */
    id: number;
    /**
     * The name of the series item.
     */
    name?: string;
    /**
     * The color of the series item.
     */
    color?: string;
    /**
     * The type of the series item.
     */
    type?: ChartWizardSeriesType;
    /**
     * The data of the series item.
     */
    data?: any[];
    /**
     * The stack of the series item.
     */
    stack?: ChartWizardSeriesStack | false;
    /**
     * The labels of the series item.
     */
    labels?: ChartWizardSeriesItemLabel;
    /**
     * The categoryField of the series item.
     */
    categoryField?: string;
    /**
     * The field of the series item.
     */
    field?: string;
    /**
     * The width of the series item.
     */
    width?: number;
}

/**
 * Represents the state of the ChartWizard component.
 */
export interface ChartWizardState {
    /**
     * The title configuration of the chart.
     */
    title?: ChartWizardTitle;
    /**
     * The subtitle configuration of the chart.
     */
    subtitle?: ChartWizardTitle;
    /**
     * The area configuration of the chart.
     */
    area: ChartWizardArea;
    /**
     * The category axis configuration of the chart.
     */
    categoryAxis: ChartWizardCategoryAxisItem[];
    /**
     * The value axis configuration of the chart.
     */
    valueAxis: ChartWizardValueAxisItem[];
    /**
     * The series configuration of the chart.
     */
    series: ChartWizardSeriesItem[];
    /**
     * The initial series configuration of the chart.
     */
    initialSeries: ChartWizardSeriesItem[];
    /**
     * The legend configuration of the chart.
     */
    legend?: ChartWizardLegend;
    /**
     * The columns of the chart.
     */
    columns: string[];
    /**
     * The data of the chart.
     */
    data: ChartWizardDataRow[];
    /**
     * The series type of the chart.
     *
     * The supported series types are:
     * - `'column'`
     * - `'bar'`
     * - `'line'`
     * - `'pie'`
     * - `'scatter'`
     */
    seriesType?: ChartWizardSeriesType;
    /**
     * The categoryField configuration of the series.
     */
    categoryField?: string;
    /**
     * The valueField configuration of the series.
     */
    valueField?: string;
    /**
     * The stack configuration of the series.
     */
    stack?: ChartWizardSeriesStack | false;
}

/**
 * The default state of the ChartWizard component.
 */
export interface ChartWizardDefaultState extends Pick<ChartWizardState, 'stack' | 'seriesType'> { }

declare enum ActionTypes {
    seriesType = 0,
    stacked = 1,
    categoryAxisX = 2,
    valueAxisY = 3,
    seriesChange = 4,
    areaMarginLeft = 5,
    areaMarginRight = 6,
    areaMarginTop = 7,
    areaMarginBottom = 8,
    areaBackground = 9,
    titleText = 10,
    titleFontName = 11,
    titleFontSize = 12,
    titleColor = 13,
    subtitleText = 14,
    subtitleFontName = 15,
    subtitleFontSize = 16,
    subtitleColor = 17,
    seriesColor = 18,
    seriesLabel = 19,
    legendVisible = 20,
    legendFontName = 21,
    legendFontSize = 22,
    legendColor = 23,
    legendPosition = 24,
    categoryAxisTitleText = 25,
    categoryAxisTitleFontName = 26,
    categoryAxisTitleFontSize = 27,
    categoryAxisTitleColor = 28,
    categoryAxisLabelsFontName = 29,
    categoryAxisLabelsFontSize = 30,
    categoryAxisLabelsColor = 31,
    categoryAxisLabelsRotation = 32,
    categoryAxisReverseOrder = 33,
    valueAxisTitleText = 34,
    valueAxisTitleFontName = 35,
    valueAxisTitleFontSize = 36,
    valueAxisTitleColor = 37,
    valueAxisLabelsFormat = 38,
    valueAxisLabelsFontName = 39,
    valueAxisLabelsFontSize = 40,
    valueAxisLabelsColor = 41,
    valueAxisLabelsRotation = 42
}

declare const ChartWizardMessages: {
    readonly windowTitle: string;
    readonly exportButton: string;
    readonly exportPDFButton: string;
    readonly exportSVGButton: string;
    readonly exportPNGButton: string;
    readonly tabChart: string;
    readonly tabData: string;
    readonly tabFormat: string;
    readonly barChart: string;
    readonly barChartBar: string;
    readonly barChartStackedBar: string;
    readonly barChart100StackedBar: string;
    readonly pieChart: string;
    readonly pieChartPie: string;
    readonly columnChart: string;
    readonly columnChartColumn: string;
    readonly columnChartStackedColumn: string;
    readonly columnChart100StackedColumn: string;
    readonly lineChart: string;
    readonly lineChartLine: string;
    readonly lineChartStackedLine: string;
    readonly lineChart100StackedLine: string;
    readonly scatterChart: string;
    readonly scatterChartScatter: string;
    readonly configuration: string;
    readonly configurationCategoryAxis: string;
    readonly configurationXAxis: string;
    readonly configurationValueAxis: string;
    readonly configurationSeries: string;
    readonly configurationSeriesAdd: string;
    readonly formatChartArea: string;
    readonly formatChartAreaMargins: string;
    readonly formatChartAreaMarginsAuto: string;
    readonly formatChartAreaMarginsLeft: string;
    readonly formatChartAreaMarginsRight: string;
    readonly formatChartAreaMarginsTop: string;
    readonly formatChartAreaMarginsBottom: string;
    readonly formatChartAreaBackground: string;
    readonly formatChartAreaBackgroundColor: string;
    readonly formatTitle: string;
    readonly formatTitleApplyTo: string;
    readonly formatTitleChartTitle: string;
    readonly formatTitleChartSubtitle: string;
    readonly formatTitleLabel: string;
    readonly formatTitleFont: string;
    readonly formatTitleFontPlaceholder: string;
    readonly formatTitleSize: string;
    readonly formatTitleSizePlaceholder: string;
    readonly formatTitleColor: string;
    readonly formatSeries: string;
    readonly formatSeriesApplyTo: string;
    readonly formatSeriesAllSeries: string;
    readonly formatSeriesColor: string;
    readonly formatSeriesShowLabels: string;
    readonly formatLegend: string;
    readonly formatLegendShowLegend: string;
    readonly formatLegendFont: string;
    readonly formatLegendFontPlaceholder: string;
    readonly formatLegendSize: string;
    readonly formatLegendSizePlaceholder: string;
    readonly formatLegendColor: string;
    readonly formatLegendPosition: string;
    readonly formatLegendPositionTop: string;
    readonly formatLegendPositionBottom: string;
    readonly formatLegendPositionLeft: string;
    readonly formatLegendPositionRight: string;
    readonly formatCategoryAxis: string;
    readonly formatXAxis: string;
    readonly formatCategoryAxisTitle: string;
    readonly formatCategoryAxisTitlePlaceholder: string;
    readonly formatCategoryAxisTitleFont: string;
    readonly formatCategoryAxisTitleFontPlaceholder: string;
    readonly formatCategoryAxisTitleSize: string;
    readonly formatCategoryAxisTitleSizePlaceholder: string;
    readonly formatCategoryAxisTitleColor: string;
    readonly formatCategoryAxisLabels: string;
    readonly formatCategoryAxisLabelsFont: string;
    readonly formatCategoryAxisLabelsFontPlaceholder: string;
    readonly formatCategoryAxisLabelsSize: string;
    readonly formatCategoryAxisLabelsSizePlaceholder: string;
    readonly formatCategoryAxisLabelsColor: string;
    readonly formatCategoryAxisLabelsRotation: string;
    readonly formatCategoryAxisLabelsRotationAuto: string;
    readonly formatCategoryAxisLabelsReverseOrder: string;
    readonly formatValueAxis: string;
    readonly formatYAxis: string;
    readonly formatValueAxisTitle: string;
    readonly formatValueAxisTitlePlaceholder: string;
    readonly formatValueAxisTitleFont: string;
    readonly formatValueAxisTitleFontPlaceholder: string;
    readonly formatValueAxisTitleSize: string;
    readonly formatValueAxisTitleSizePlaceholder: string;
    readonly formatValueAxisTitleColor: string;
    readonly formatValueAxisLabels: string;
    readonly formatValueAxisLabelsFormat: string;
    readonly formatValueAxisLabelsFormatText: string;
    readonly formatValueAxisLabelsFormatNumber: string;
    readonly formatValueAxisLabelsFormatCurrency: string;
    readonly formatValueAxisLabelsFormatPercent: string;
    readonly formatValueAxisLabelsFont: string;
    readonly formatValueAxisLabelsFontPlaceholder: string;
    readonly formatValueAxisLabelsSize: string;
    readonly formatValueAxisLabelsSizePlaceholder: string;
    readonly formatValueAxisLabelsColor: string;
    readonly formatValueAxisLabelsRotation: string;
    readonly formatValueAxisLabelsRotationAuto: string;
}

export const ChartWizardCommon: Readonly<{
    ActionTypes: typeof ActionTypes;
    messages: typeof ChartWizardMessages;

    fontSizes: { text: string; value: string }[];
    fontNames: { text: string; value: string;  style: { fontFamily: string }}[];

    isCategorical(seriesType?: ChartWizardSeriesType): boolean;
    parseFont(font?: string): { name: string; size: string };
    createInitialState(data: ChartWizardDataRow[], seriesType: ChartWizardSeriesType, defaultState?: ChartWizardDefaultState): ChartWizardState;
    createState(data: ChartWizardDataRow[], seriesType: ChartWizardSeriesType): ChartWizardState;
    mergeStates(sourceState: ChartWizardState, targetState: ChartWizardState): ChartWizardState;
    updateState(currentState: ChartWizardState, action: ActionTypes, value: any): ChartWizardState;

    /**
     * Maps data rows to the ChartWizard data format.
     *
     * @returns collection that can be used as ChartWizard.
     */
    getWizardDataFromDataRows(dataRows: DataRow[]): ChartWizardDataRow[];
}>;
