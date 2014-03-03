﻿"use strict";

//*****MAIN*****
function CChartsDrawer()
{
	this.graphics = null;
	
	this.calcProp = {};
	
	this.allAreaChart = null;
	this.gridChart = null;
	this.chart = null;
}

CChartsDrawer.prototype =
{
    reCalculate : function(chartSpace)
    {
		this.calcProp = {};
		this._calculateProperties(chartSpace);

		//создаём область
		this.allAreaChart = new allAreaChart();
		
		//создаём область
		this.areaChart = new areaChart();
		
		//создаём сетку
		this.gridChart = new gridChart();
		
		//ось категорий
		this.catAxisChart = new catAxisChart();
		//ось значений
		this.valAxisChart = new valAxisChart();
		
		//draw chart
		var newChart;
		switch ( this.calcProp.type )
		{
			case "Bar":
			{
				newChart = new drawBarChart();
				break;
			}
			case "Line":
			{
				newChart = new drawLineChart();
				break;
			}
			
			case "HBar":
			{
				newChart = new drawHBarChart();
				break;
			}
			
			case "Pie":
			{
				newChart = new drawPieChart();
				break;
			}
			
			case "Scatter":
			{
				newChart = new drawScatterChart();
				break;
			}
			
			case "Area":
			{
				newChart = new drawAreaChart();
				break;
			}
			
			case "Stock":
			{
				newChart = new drawStockChart();
				break;
			}
		}
		this.chart = newChart;
		
		//делаем полный пресчёт
		this.areaChart.reCalculate(this.calcProp, null, this);
		this.gridChart.reCalculate(this.calcProp, null, chartSpace);
		this.allAreaChart.reCalculate(this.calcProp);
		
		if(this.calcProp.type != "Pie")
		{
			this.catAxisChart.reCalculate(this.calcProp, null, chartSpace);
			this.valAxisChart.reCalculate(this.calcProp, null, chartSpace);
		}

		this.chart.reCalculate(this, chartSpace);
	},
	
	draw : function(chartSpace, graphics)
    {
		var cShapeDrawer = new CShapeDrawer();
		cShapeDrawer.Graphics = graphics;
		this.calcProp.series = chartSpace.chart.plotArea.chart.series;
		
		//отрисовываем без пересчёта
		this.allAreaChart.draw(this.calcProp, cShapeDrawer, chartSpace);
		this.areaChart.draw(this.calcProp, cShapeDrawer, chartSpace);
		
		if(this.calcProp.type != "Pie")
		{
			this.catAxisChart.draw(this.calcProp, cShapeDrawer, chartSpace);
			this.valAxisChart.draw(this.calcProp, cShapeDrawer, chartSpace);
		}
		
		this.gridChart.draw(this.calcProp, cShapeDrawer, chartSpace);
		this.chart.draw(this, cShapeDrawer, chartSpace);
	},
	
	reCalculatePositionText : function(type, chartSpace, ser, val)
	{
		var pos;
		switch ( type )
		{
			case "dlbl":
			{
				pos = this._calculatePositionDlbl(chartSpace, ser, val);
				break;
			}
			case "title":
			{
				pos = this._calculatePositionTitle(chartSpace);
				break;
			}
			case "valAx":
			{
				pos = this._calculatePositionValAx(chartSpace);
				break;
			}
			case "catAx":
			{
				pos = this._calculatePositionCatAx(chartSpace);
				break;
			}
			case "legend":
			{
				pos = this._calculatePositionLegend(chartSpace);
				break;
			}
			default:
			{
				pos = {x: 0, y: 0};
				break;
			}
		}
		return {x: pos.x, y : pos.y};
	},
	
	_calculatePositionDlbl: function(chartSpace, ser, val)
	{	
		return this.chart._calculateDLbl(chartSpace, ser, val);
	},
	
	_calculatePositionTitle: function(chartSpace)
	{	
		var widthGraph = chartSpace.extX;
		var heightGraph = chartSpace.extY;
		
		var widthTitle = chartSpace.chart.title.extX;
		var heightTitle = chartSpace.chart.title.extY;
		var standartMargin = 7;
		
		var y = standartMargin / this.calcProp.pxToMM;
		var x = widthGraph / 2 - widthTitle / 2;
		
		return {x: x, y: y}
	},
	
	_calculatePositionValAx: function(chartSpace)
	{	
		var widthTitle = chartSpace.chart.plotArea.valAx.title.extX;
		var heightTitle = chartSpace.chart.plotArea.valAx.title.extY;
		var standartMargin = 13;
		
		var y = (this.calcProp.chartGutter._top + this.calcProp.trueHeight / 2) / this.calcProp.pxToMM - heightTitle / 2;
		var x = standartMargin / this.calcProp.pxToMM;
		
		if(chartSpace.chart.legend && !chartSpace.chart.legend.overlay && chartSpace.chart.legend.legendPos == LEGEND_POS_L)
		{
			x += chartSpace.chart.legend.extX;
		}
		
		return {x: x, y: y}
	},
	
	_calculatePositionCatAx: function(chartSpace)
	{	
		var widthTitle = chartSpace.chart.plotArea.catAx.title.extX;
		var heightTitle = chartSpace.chart.plotArea.catAx.title.extY;
		var standartMargin = 13;
		
		var y = (this.calcProp.heightCanvas - standartMargin) / this.calcProp.pxToMM -  heightTitle;
		var x = (this.calcProp.chartGutter._left + this.calcProp.trueWidth / 2) / this.calcProp.pxToMM - widthTitle / 2;
		
		if(chartSpace.chart.legend && !chartSpace.chart.legend.overlay && chartSpace.chart.legend.legendPos == LEGEND_POS_B)
		{
			y -= chartSpace.chart.legend.extY;
		}
			
		return {x: x, y: y}
	},
	
	_calculatePositionLegend: function(chartSpace)
	{	
		var widthLegend = chartSpace.chart.legend.extX;
		var heightLegend = chartSpace.chart.legend.extY;
		var standartMargin = 13;
		var x, y;
		
		switch ( chartSpace.chart.legend.legendPos )
		{
			case LEGEND_POS_L:
			{
				x = standartMargin / 2 / this.calcProp.pxToMM;
				y = this.calcProp.heightCanvas / 2 / this.calcProp.pxToMM - heightLegend / 2;
				break;
			}
			case LEGEND_POS_T:
			{
				x = this.calcProp.widthCanvas / 2 / this.calcProp.pxToMM - widthLegend / 2;
				y = standartMargin / 2 / this.calcProp.pxToMM;
				
				if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				{
					y += chartSpace.chart.title.extY + standartMargin / 2 / this.calcProp.pxToMM;
				}
				break;
			}
			case LEGEND_POS_R:
			{
				x = (this.calcProp.widthCanvas - standartMargin / 2) / this.calcProp.pxToMM  - widthLegend;
				y = (this.calcProp.heightCanvas / 2) / this.calcProp.pxToMM - heightLegend / 2;
				break;
			}
			case LEGEND_POS_B:
			{
				x = this.calcProp.widthCanvas / 2 / this.calcProp.pxToMM - widthLegend / 2;
				y = (this.calcProp.heightCanvas - standartMargin / 2) / this.calcProp.pxToMM - heightLegend;
				break;
			}
			case LEGEND_POS_TR:
			{
				x = (this.calcProp.widthCanvas - standartMargin / 2) / this.calcProp.pxToMM  - widthLegend;
				y = standartMargin / 2 / this.calcProp.pxToMM;
				
				if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				{
					y += chartSpace.chart.title.extY + standartMargin / 2 / this.calcProp.pxToMM;
				}
				break;
			}
			default:
			{
				x = (this.calcProp.widthCanvas  - standartMargin / 2) / this.calcProp.pxToMM  - widthLegend;
				y = (this.calcProp.heightCanvas) / this.calcProp.pxToMM - heightLegend / 2;
				break;
			}
		}
		
		return {x: x, y: y}
	},
	
	_calculateProperties: function(chartProp)
	{
		if(!this.calcProp.scale)
			this.preCalculateData(chartProp);
		
		//считаем маргины
		this._calculateMarginsChart(chartProp);
		
		this.calcProp.trueWidth = this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right;
		this.calcProp.trueHeight = this.calcProp.heightCanvas - this.calcProp.chartGutter._top - this.calcProp.chartGutter._bottom;
		
		this._calculateWidthChart();
		
		
		//count line of chart grid
		if((chartProp.chart.plotArea.valAx.yPoints && chartProp.chart.plotArea.catAx.xPoints) || (chartProp.chart.plotArea.catAx.yPoints && chartProp.chart.plotArea.valAx.xPoints))
		{	
			if(chartProp.chart.plotArea.valAx.yPoints)
				this.calcProp.numhlines = chartProp.chart.plotArea.valAx.yPoints.length - 1;
			if(this.calcProp.type == "Bar")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == "HBar")
			{
				this.calcProp.numhlines = chartProp.chart.plotArea.catAx.yPoints.length;
				this.calcProp.numvlines = chartProp.chart.plotArea.valAx.xPoints.length - 1;
				
				this.calcProp.numhMinorlines = 2;
				this.calcProp.numvMinorlines = 5;
			}
			else if(this.calcProp.type == "Line" || this.calcProp.type == "Stock")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == "Scatter")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 5;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == "Area")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
		}
		
		
		if(this.calcProp.type != "Scatter")
			this.calcProp.nullPositionOX = this._getNullPosition();
		else
		{
			var scatterNullPos = this._getScatterNullPosition();
			this.calcProp.nullPositionOX = scatterNullPos.x;
			this.calcProp.nullPositionOY = scatterNullPos.y;
		}
	
		if(this.calcProp.type == "Bar")
		{
			this.calcProp.max = this.calcProp.scale[this.calcProp.scale.length -1];
			this.calcProp.min = this.calcProp.scale[0];
		}
	},
	
	preCalculateData: function(chartProp)
	{
		this.calcProp.pxToMM = 1 / chartProp.convertPixToMM(1);
		
		this.calcProp.pathH = 1000000000;
		this.calcProp.pathW = 1000000000;
		
		var typeChart = chartProp.chart.plotArea.chart.getObjectType();
		
		switch ( typeChart )
		{
			case historyitem_type_LineChart:
			{
				this.calcProp.type = "Line";
				break;
			}
			case historyitem_type_BarChart:
			{
				if(chartProp.chart.plotArea.chart.barDir == 1)
					this.calcProp.type = "Bar";
				else 
					this.calcProp.type = "HBar";
				break;
			}
			case historyitem_type_PieChart:
			{
				this.calcProp.type = "Pie";
				break;
			}
			case historyitem_type_AreaChart:
			{
				this.calcProp.type = "Area";
				break;
			}
			case historyitem_type_ScatterChart:
			{
				this.calcProp.type = "Scatter";
				break;
			}
			case historyitem_type_StockChart:
			{
				this.calcProp.type = "Stock";
				break;
			}
		};
		
		var grouping = chartProp.chart.plotArea.chart.grouping;
		if(this.calcProp.type == "Line" || this.calcProp.type == "Area")
			this.calcProp.subType = (grouping === GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === GROUPING_STACKED) ? "stacked" : "normal"
		else
			this.calcProp.subType = (grouping === BAR_GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === BAR_GROUPING_STACKED) ? "stacked" : "normal"
		
		
		this.calcProp.xaxispos = null;
		this.calcProp.yaxispos = null;
		
		//рассчёт данных и ещё некоторых параметров(this.calcProp./min/max/ymax/ymin/data)
		this._calculateData(chartProp);
		
		//пересчёт данных для накопительных диаграмм
		if(this.calcProp.subType == 'stackedPer' || this.calcProp.subType == 'stacked')
			this._calculateStackedData();
		
		//***series***
		this.calcProp.series = chartProp.chart.plotArea.chart.series;
		
		//находим значния для осей
		this.calcProp.scale = this._getAxisData(false, this.calcProp, this.calcProp.min, this.calcProp.max, this.calcProp.ymin, this.calcProp.ymax);	
		if(this.calcProp.type == "Scatter")
			this.calcProp.xScale = this._getAxisData(true, this.calcProp, this.calcProp.min, this.calcProp.max, this.calcProp.ymin, this.calcProp.ymax);
		
		this.calcProp.widthCanvas = chartProp.extX*this.calcProp.pxToMM;
		this.calcProp.heightCanvas = chartProp.extY*this.calcProp.pxToMM;
	},
	
	_calculateStackedData: function()
	{	
		if(this.calcProp.type == "Bar")
		{
			if (this.calcProp.subType == 'stackedPer') {
				var summ
				for (var j = 0; j < (this.calcProp.data.length); j++) {
					summ = 0;
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						summ += Math.abs(this.calcProp.data[j][i]);
					}
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j][i] = (this.calcProp.data[j][i] * 100) / summ;
						if(isNaN(this.calcProp.data[j][i]))
							this.calcProp.data[j][i] = 0;
					}
				}
			}
		};
		
		
		if(this.calcProp.type == "Line" || this.calcProp.type == "Area")
		{
			if (this.calcProp.subType == 'stacked') {
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						if(!this.calcProp.data[j + 1])
							this.calcProp.data[j + 1] = [];
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i];
					}
				}
				this.calcProp.max = this._getMaxValueArray(this.calcProp.data);
				this.calcProp.min = this._getMinValueArray(this.calcProp.data);
			}
			else if (this.calcProp.subType == 'stackedPer') {
				var firstData = this.calcProp.data;
				
				var summValue = [];
				for (var j = 0; j < (firstData[0].length); j++) {
					summValue[j] = 0;
					for (var i = 0; i < firstData.length; i++) {
						summValue[j] += Math.abs(firstData[i][j])
					}
				}
				
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i]
					}
				}
				
				var tempData = this.calcProp.data;

				for (var j = 0; j < (tempData[0].length); j++) {
					for (var i = 0; i < tempData.length; i++) {
						if(summValue[j] == 0)
							tempData[i][j] = 0;
						else
							tempData[i][j] = (100 * tempData[i][j]) / (summValue[j]);
					}
				}
				this.calcProp.max = this._getMaxValueArray(tempData);
				this.calcProp.min = this._getMinValueArray(tempData);
				this.calcProp.data = tempData;
			}
		};
		
		
		if(this.calcProp.type == "HBar")
		{
			var originalData = $.extend(true, [], this.calcProp.data);
			if (this.calcProp.subType == 'stacked') {
				for (var j = 0; j < this.calcProp.data.length; j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j][i] = this._findPrevValue(originalData, j, i)
					}
				}
			}
			else if (this.calcProp.subType == 'stackedPer') {
				var sumMax = [];
				//находим суммы для нормированной диаграммы
				for (var j = 0; j < (this.calcProp.data.length); j++) {
					sumMax[j] = 0;
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						sumMax[j] += Math.abs(this.calcProp.data[j][i]);
					}
				}


				for (var j = 0; j < (this.calcProp.data.length); j++) {
					for (var i = 0; i < (this.calcProp.data[j].length); i++) {
						this.calcProp.data[j][i] = this._findPrevValue(originalData, j, i)
					}
				}

				var tempData = this.calcProp.data;

				for (var j = 0; j < (this.calcProp.data.length); j++) {
					for (var i = 0; i < (this.calcProp.data[j].length); i++) {
						tempData[j][i] = (100 * tempData[j][i]) / (sumMax[j]);
						if(isNaN(tempData[j][i]))
							tempData[j][i] = 0;
					}
				}
				this.calcProp.data = tempData;
			}
		};
	},
	
	_getSumArray: function (arr, isAbs)
    {
        if (typeof(arr) == 'number') {
            return arr;
        }
		else if(typeof(arr) == 'string'){
			return parseFloat(arr);
		}

        var i, sum;
        for(i = 0,sum = 0; i < arr.length; i++)
		{
			if(typeof(arr[i]) == 'object' && arr[i].val)
				sum += parseFloat(isAbs ? Math.abs(arr[i].val) : arr[i].val);
			else
				sum += isAbs ? Math.abs(arr[i]) : arr[i];
		}
        return sum;
    },
	
	_getMaxValueArray: function(array)
	{
		var max = 0;
		for(var i = 0; i < array.length; i++)
		{
			for(var j = 0; j < array[i].length; j++)
			{
				if(i == 0 && j == 0)
					max =  array[i][j];
				if(array[i][j] > max)
					max = array[i][j];
			}
		}
		return max;
	},
	
	_getMinValueArray: function(array)
	{
		var min = 0;
		for(var i = 0; i < array.length; i++)
		{
			for(var j = 0; j < array[i].length; j++)
			{
				if(i == 0 && j == 0)
					min =  array[i][j];
				if(array[i][j] < min)
					min = array[i][j];
			}
		}
		return min;
	},
	
	_findPrevValue: function(originalData, num, max) {
		var summ = 0;
		for (var i = 0; i <= max; i++) {
			if (originalData[num][max] >= 0) {
				if (originalData[num][i] >= 0)
					summ += originalData[num][i];
			}

			else {
				if (originalData[num][i] < 0)
					summ += originalData[num][i];
			}
		}
		return summ;
	},
	
	_calculateData: function(chart) {
		var isSeries = false;
		var formatCell = 'General';
		var formatCellScOy = 'General';
		var defaultFormat = 'General';
		var isDateTimeFormat;
		
		var api_doc = window["editor"];
		var api_sheet = window["Asc"]["editor"];
		var styleManager = api_doc ? api_doc.chartStyleManager : api_sheet.chartStyleManager;

		var arrFormatAdobeLabels = [];
		var catNameLabels = [];
		
		//просматриваем bShowValue для каждой из серий 
		//TODO позже отрисовывать значения для каждой серии индивидуально
		/*if ( !chart.bShowValue ) {
			for (var n = 0; n < chart.series.length; n++) {
				if ( chart.series[n].bShowValue ) {
					chart.bShowValue = true;
					break;
				}
			}
		}
				
		if(chart.bShowCatName)
			chart.bShowValue = true;*/
		
		
		var max = 0;
		var min = 0; 
		var minY = 0;
		var maxY = 0;
		var newArr, formatAdobeLabel;
		
		var series = chart.chart.plotArea.chart.series;
		if(series && series.length != 0 && this.calcProp.type != 'Scatter')//берём данные из NumCache
		{
			isSeries = true;
			/*chart.reSeries = chart.series;
			if(chart.type == 'Pie')
			{
				series = chart.getReverseSeries(true);
				chart.reSeries = series;
			}*/

			var arrValues = [];
			var isSkip = [];
			var skipSeries = [];
			
			var isEn = false;
			var isEnY = false;
			var numSeries = 0;
			var curSeria;
			var isNumberVal = true;
			if(series[0] && series[0].xVal && series[0].xVal.Formula != null && this.calcProp.type == 'Scatter')
			{
				var cash = series[0].xVal.NumCache;
				for(var i = 0; i < cash.length; i++)
				{
					if(!isNumber(cash.val))
						isNumberVal = false;
				}
			}
			
			for(var l = 0; l < series.length; ++l)
			{
				var firstCol = 0;
				var firstRow = 0;
				if(series[0].xVal && numSeries == 0 && this.calcProp.type == 'Scatter' && series[numSeries].xVal.numRef.numCache.pts.length)
				{
					curSeria = series[numSeries].xVal.numRef.numCache.pts;
				}
				else if(this.calcProp.type == 'Scatter')
					curSeria = series[numSeries].yVal.numRef.numCache.pts;
				else
					curSeria = series[l].val.numRef.numCache.pts;
				
				var lastCol = curSeria.length;
				skipSeries[l] = true;
				var isRow = false;
				if(firstCol == lastCol)
					isRow  = true;
			
				if(series[l].isHidden == true)
				{
					continue;
				}
				if(!curSeria.length)
				{
					continue;
				}
				if(series[0].xVal && numSeries == 0 && this.calcProp.type == 'Scatter')
					l--;
				skipSeries[l] = false;
				arrValues[numSeries] = [];
				arrFormatAdobeLabels[numSeries] = [];
				catNameLabels[numSeries] = [];
				isSkip[numSeries] = true;
		
				var row = firstRow;
				var n = 0;
				for(var col = firstCol; col < lastCol; ++col)
				{
					if(!curSeria[col])
					{
						curSeria[col] = {val:0};
					}
					else if(curSeria[col].isHidden == true)
					{
						continue;
					}
					
					//var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
					var cell = curSeria[col];
					
					if(numSeries == 0 && col == firstCol && chart.subType != 'stackedPer' && this.calcProp.type != 'Stock')
					{
						formatCell = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
						isDateTimeFormat = cell.isDateTimeFormat;
					}
					else if(this.calcProp.type == 'Stock' && numSeries == 0 && col == firstCol)
					{
						formatCellScOy = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
						isDateTimeFormat = cell.isDateTimeFormat;
					}
					
					if(this.calcProp.type == 'Scatter')
					{
						if(numSeries == 1 && col == firstCol)
							formatCellScOy = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
					}
					
					formatAdobeLabel = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
					
					var orValue = cell.val;
					if(series[0].xVal && series[0].xVal.Formula != null && numSeries == 0 && !isNumberVal && this.calcProp.type == 'Scatter')
						orValue = col - firstCol + 1;
					if('' != orValue)
						isSkip[numSeries] = false;
					var value =  parseFloat(orValue)
					if(!isEn && !isNaN(value))
					{
						min = value;
						max = value;
						isEn = true;
					}
					if(!isNaN(value) && value > max)
						max = value
					if(!isNaN(value) && value < min)
						min = value
					if(isNaN(value) && orValue == '' && (((this.calcProp.type == 'Line' ) && this.calcProp.type == 'normal') || (this.calcProp.type == 'Scatter' )))
					{
						value = '';
					}
					else if (isNaN(value))
					{
						if(this.calcProp.type == "Bar" || this.calcProp.type == "HBar")
							formatAdobeLabel = null;
						value = 0;
					}
					if(this.calcProp.type == 'Pie')
						arrValues[numSeries][n] = Math.abs(value);
					else
						arrValues[numSeries][n] = value;
					arrFormatAdobeLabels[numSeries][n] = formatAdobeLabel;
					if(chart.bShowCatName && this.calcProp.type != 'Scatter')
					{
						if(series[numSeries] && series[numSeries].Cat && series[numSeries].Cat.NumCache[col] && this.calcProp.type != "Pie")
							catNameLabels[numSeries][n] = series[numSeries].Cat.NumCache[col].val;
						else if(this.calcProp.type != "Pie" && series[numSeries] && series[numSeries].TxCache)
							catNameLabels[numSeries][n] = series[numSeries].TxCache.Tx;
						else if(series[numSeries] && series[numSeries] && series[numSeries].TxCache)
							catNameLabels[numSeries][n] = series[numSeries].TxCache.Tx;
						
					}
					n++;
				}
				numSeries++;
			}
		}
		else
		{
			var yVal;
			var xVal;
			newArr = [];
			for(var l = 0; l < series.length; ++l)
			{
				newArr[l] = [];
				for(var j = 0; j < series[l].yVal.numRef.numCache.pts.length; ++j)
				{
					yVal = parseFloat(series[l].yVal.numRef.numCache.pts[j].val);
					if(series[l].xVal)
						xVal = parseFloat(series[l].xVal.numRef.numCache.pts[j].val);
					else
						xVal = j + 1;
					newArr[l][j] = [xVal, yVal];
					
					if(l == 0 && j == 0)
					{
						min = xVal;
						max = xVal;
						minY = yVal;
						maxY = yVal;
					};
					
					if(xVal < min)
						min = xVal;
					if(xVal > max)
						max = xVal;
					if(yVal < minY)
						minY = yVal;
					if(yVal > maxY)
						maxY = yVal;
				}
			}
			this.calcProp.ymin = minY;
			this.calcProp.ymax = maxY;
		}

		
		if(isSeries)
		{
			var arrFormatAdobeLabelsRev = arrFormatAdobeLabels;
			var arrValuesRev = arrValues;
		}
			
		isEn = false;
		if(this.calcProp.type == 'Scatter' && !newArr)
		{
			/*min = 0;
			max = 0;
			minY = 0;
			maxY = 0;
			var isEnY = false
			var scatterArr = arrValuesRev;
			var scatterArrLabels = arrFormatAdobeLabelsRev;
			if(!scatterArr)
			{
				scatterArr = arrReverse(arrValues);
				scatterArrLabels = arrReverse(arrFormatAdobeLabels);
			}
				
			var newArr = [];
			var newAdobeLabels = [];
			if(isDateTimeFormat)
			{
				formatCellScOy = formatCell;
				formatCell = 'General';
				
				for (i = 0; i < scatterArr.length; ++i) {
					newArr[i] = [];
					newAdobeLabels[i] = [];
					for (j = 0; j < scatterArr[i].length; ++j) {
						newArr[i][j] = [];
						newAdobeLabels[i][j] = [];
						newArr[i][j][0] = j+1;
						newArr[i][j][1] = scatterArr[i][j];
						newAdobeLabels[i][j][1] = scatterArrLabels[i][j];
						if(!isEn)
						{
							min = newArr[i][j][0];
							max = newArr[i][j][0];
							minY = newArr[i][j][1];
							minY = newArr[i][j][1];
							isEn = true;
						}
						if(min > newArr[i][j][0] && newArr[i][j][0] != '')
							min =  newArr[i][j][0]
						if(max < newArr[i][j][0] && newArr[i][j][0] != '')
							max = newArr[i][j][0]
						if(minY > newArr[i][j][1] && newArr[i][j][1] != '')
							minY =  newArr[i][j][1]
						if(maxY < newArr[i][j][1] && newArr[i][j][1] != '')
							maxY = newArr[i][j][1]
					}
				}
			}*/
		}
		
		if(!arrValuesRev)
			arrValuesRev = arrReverse(arrValues);
		
		if(!arrFormatAdobeLabelsRev)
			arrFormatAdobeLabelsRev = arrReverse(arrFormatAdobeLabels);
			
		this.calcProp.isFormatCell = formatCell;
		this.calcProp.isformatCellScOy = formatCellScOy;
		this.calcProp.min = min;
		this.calcProp.max = max;
		
		/*if(skipSeries)
			this.calcProp.skipSeries = skipSeries;*/
			
		this.calcProp.catNameLabels = null;	
		if(newArr != undefined)
		{
			//chart.arrFormatAdobeLabels = newAdobeLabels;
			this.calcProp.data = newArr;
		}	
		else
		{
			if(isSeries)
			{
				if(this.calcProp.type == 'HBar' || this.calcProp.type == 'Bar' || this.calcProp.type == 'Stock' || this.calcProp.type == 'Pie')
				{
					arrValuesRev = arrReverse(arrValues);
					this.calcProp.arrFormatAdobeLabels = arrReverse(arrFormatAdobeLabels);
					if(catNameLabels && catNameLabels.length)
						this.calcProp.catNameLabels = arrReverse(catNameLabels);
					this.calcProp.data = arrValuesRev;
				}
				else
				{
					this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabels;
					if(catNameLabels && catNameLabels.length)
						this.calcProp.catNameLabels = catNameLabels;
					this.calcProp.data = arrValues;
				}
			}
			else
			{
				if (chart.range.rows)
				{
					if(this.calcProp.type == 'HBar' || this.calcProp.type == 'Bar' || this.calcProp.type == 'Stock')
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabelsRev;
						this.calcProp.data = arrValuesRev;
					}
					else
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabels;
						this.calcProp.data = arrValues;
					}
				}
				else
				{
					if(this.calcProp.type == 'HBar' || this.calcProp.type == 'Bar' || this.calcProp.type == 'Stock')
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabels;
						this.calcProp.data = arrValues;
					}
					else
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabelsRev;
						this.calcProp.data = arrValuesRev;
					}
				}
			}
			
		}
	},
	
	_calculateWidthChart: function() {
		var trueWidth = this.calcProp.trueWidth;
		var trueHeight = this.calcProp.trueHeight;
		
		if('Line' == this.calcProp.type)
		{
			var lengthOfData = this.calcProp.data[0].length;
			var widthChart = (trueWidth/lengthOfData)*(lengthOfData - 1) + 5;
			
			this.calcProp.hmargin = (trueWidth - widthChart) / 2;
		}
		else {
			var pointKoff = 1 - 1 / (this.calcProp.data[0].length)
			this.calcProp.hmargin = (trueWidth - trueWidth * pointKoff) / 2;
		}
		if('Area' == this.calcProp.type)
			this.calcProp.hmargin = 0;
	},
	
	calculateSizePlotArea : function(chartSpace)
	{
		this._calculateMarginsChart(chartSpace);
		
		var widthCanvas = chartSpace.extX;
		var heightCanvas = chartSpace.extY;
		
		var w = widthCanvas - (this.calcProp.chartGutter._left + this.calcProp.chartGutter._right) / this.calcProp.pxToMM;
		var h = heightCanvas - (this.calcProp.chartGutter._top + this.calcProp.chartGutter._bottom) / this.calcProp.pxToMM;
		

        return {w: w , h: h , startX: this.calcProp.chartGutter._left / this.calcProp.pxToMM, startY: this.calcProp.chartGutter._top / this.calcProp.pxToMM};
	},
	
	_calculateMarginsChart: function(chartSpace) {
		this.calcProp.chartGutter = {};
		
		if(!this.calcProp.pxToMM)
			this.calcProp.pxToMM = 1 / chartSpace.convertPixToMM(1);
		
		var pxToMM = this.calcProp.pxToMM;
		var standartMargin = 13 / pxToMM;
		var isHBar = (chartSpace.chart.plotArea.chart.getObjectType() == historyitem_type_BarChart && chartSpace.chart.plotArea.chart.barDir != 1) ? true : false;
		
		//высчитываем выходящие за пределы подписи осей
		var labelsMargin = this._calculateMarginLabels(chartSpace);
		
		var left = labelsMargin.left, right = labelsMargin.right, top = labelsMargin.top, bottom = labelsMargin.bottom;
		
		//****left*****
		if(left || !right)
		{
			if(chartSpace.chart.plotArea.valAx.title != null && !isHBar)
				left += chartSpace.chart.plotArea.valAx.title.extX + standartMargin;
			else if(isHBar && chartSpace.chart.plotArea.catAx.title != null)
				left += chartSpace.chart.plotArea.catAx.title.extX + standartMargin;
			else
				left += standartMargin / 2;
		}
		else
			left += standartMargin;
		
		
		//****right*****
		if(right)
		{
			right += standartMargin / 2;
			if(chartSpace.chart.plotArea.valAx.title != null && !isHBar)
				right += chartSpace.chart.plotArea.valAx.title.extX;
			else if(isHBar && chartSpace.chart.plotArea.catAx.title != null)
				right += chartSpace.chart.plotArea.catAx.title.extX;
		}
		else
			right += standartMargin;
		
		
		//****bottom*****
		if(bottom || !top)
		{
			if(chartSpace.chart.plotArea.catAx.title != null && !isHBar)
				bottom += chartSpace.chart.plotArea.catAx.title.extY + standartMargin;
			else if(isHBar && chartSpace.chart.plotArea.valAx.title != null)
				bottom += chartSpace.chart.plotArea.valAx.title.extY + standartMargin;
			else
				bottom += standartMargin / 2;
		}
		else
			bottom += standartMargin;
		
		
		//****top*****
		if(top)
		{
			top += standartMargin / 2;
			if(chartSpace.chart.plotArea.catAx.title != null && !isHBar)
				top += chartSpace.chart.plotArea.catAx.title.extY;
			else if(isHBar && chartSpace.chart.plotArea.valAx.title != null)
				top += chartSpace.chart.plotArea.valAx.title.extY;
				
			if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				top += chartSpace.chart.title.extY;
		}
		else
		{
			top += standartMargin;
			if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				top += chartSpace.chart.title.extY + standartMargin / 2;
		}
			
		
		//KEY
		if(chartSpace.chart.legend && !chartSpace.chart.legend.overlay)
		{
			switch ( chartSpace.chart.legend.legendPos )
			{
				case LEGEND_POS_L:
				{
					left += chartSpace.chart.legend.extX;
					break;
				}
				case LEGEND_POS_T:
				{
					top += chartSpace.chart.legend.extY;
					break;
				}
				case LEGEND_POS_R:
				{
					right += chartSpace.chart.legend.extX;
					break;
				}
				case LEGEND_POS_B:
				{
					bottom += chartSpace.chart.legend.extY;
					break;
				}
				case LEGEND_POS_TR:
				{
					right += chartSpace.chart.legend.extX;
					break;
				}
			}
		}
		
		this.calcProp.chartGutter._left = left * pxToMM;
		this.calcProp.chartGutter._right = right * pxToMM;
		this.calcProp.chartGutter._top = top * pxToMM;
		this.calcProp.chartGutter._bottom = bottom * pxToMM;
	
	},
	
	_calculateMarginLabels: function(chartSpace)
	{
		var isHBar = this.calcProp.type;
		var left = 0, right = 0, bottom = 0, top = 0;
		
		var leftDownPointX, leftDownPointY, rightUpPointX, rightUpPointY;
		
		var valAx = chartSpace.chart.plotArea.valAx;
		var catAx = chartSpace.chart.plotArea.catAx;
		

		if(isHBar === 'HBar' && catAx.yPoints && valAx.xPoints)
		{
			if(catAx.yPoints.length > 1)
			{
				if(valAx.crossBetween == CROSS_BETWEEN_BETWEEN)
					leftDownPointY = catAx.yPoints[0].pos - (catAx.yPoints[1].pos - catAx.yPoints[0].pos) / 2;
				else
					leftDownPointY = catAx.yPoints[0].pos;
			}
			else
				leftDownPointY = catAx.labels.x;

			
			leftDownPointX = valAx.xPoints[0].pos;
			
			
			if(catAx.yPoints.length > 1)
			{
				if(valAx.crossBetween == CROSS_BETWEEN_BETWEEN)
					rightUpPointY = catAx.yPoints[0].pos - Math.abs((catAx.yPoints[1].pos - catAx.yPoints[0].pos) / 2);
				else
					rightUpPointY = catAx.yPoints[catAx.yPoints.length - 1].pos;
			}
			else
				rightUpPointY = catAx.labels.x;

			
			rightUpPointX = valAx.xPoints[valAx.xPoints.length - 1].pos;
			
			
			
			if(catAx.labels && !catAx.bDelete)
			{
				//подпись оси OY находится левее крайней левой точки
				if(leftDownPointX >= catAx.labels.x)
				{
					left = leftDownPointX - catAx.labels.x;
				}
				else if((catAx.labels.x + catAx.labels.extX) >= rightUpPointX)//правее крайней правой точки
				{
					right = catAx.labels.x + catAx.labels.extX - rightUpPointX;
				}
			}
			
			
			if(valAx.labels && !valAx.bDelete)
			{
				//подпись оси OX находится ниже крайней нижней точки
				if((valAx.labels.y + valAx.labels.extY) >= leftDownPointY)
				{
					bottom = (valAx.labels.y + valAx.labels.extY) - leftDownPointY;
				}
				else if(valAx.labels.y <= rightUpPointY)//выше верхней
				{
					top = rightUpPointY - valAx.labels.y;
				}
			}
		}
		else if(isHBar === 'Scatter' && catAx.xPoints && valAx.yPoints)
		{
			leftDownPointX = catAx.xPoints[0].pos;
			leftDownPointY = valAx.yPoints[0].pos;

			rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos;
			rightUpPointY = valAx.yPoints[valAx.yPoints.length - 1].pos;
			
			if(valAx.labels && !valAx.bDelete)
			{
				//подпись оси OY находится левее крайней левой точки
				if(leftDownPointX >= valAx.labels.x)
				{
					left = leftDownPointX - valAx.labels.x;
				}
				else if((valAx.labels.x + valAx.labels.extX) >= rightUpPointY)//правее крайней правой точки
				{
					right = valAx.labels.x + valAx.labels.extX - rightUpPointY;
				}
			}
			
			
			if(catAx.labels && !catAx.bDelete)
			{
				//подпись оси OX находится ниже крайней нижней точки
				if((catAx.labels.y + catAx.labels.extY) >= leftDownPointY)
				{
					bottom = (catAx.labels.y + catAx.labels.extY) - leftDownPointY;
				}
				else if(catAx.labels.y <= rightUpPointY)//выше верхней
				{
					top = rightUpPointY - catAx.labels.y;
				}
			}
		}
		else if(isHBar !== undefined && catAx.xPoints && valAx.yPoints)
		{
			if(catAx.xPoints.length > 1)
			{
				if(valAx.crossBetween == CROSS_BETWEEN_BETWEEN)
					leftDownPointX = catAx.xPoints[0].pos - (catAx.xPoints[1].pos - catAx.xPoints[0].pos) / 2;
				else
					leftDownPointX = catAx.xPoints[0].pos;
			}
			else
				leftDownPointX = catAx.labels.x;

			
			leftDownPointY = valAx.yPoints[0].pos;
			
			
			if(catAx.xPoints.length > 1)
			{
				if(valAx.crossBetween == CROSS_BETWEEN_BETWEEN)
					rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos + (catAx.xPoints[1].pos - catAx.xPoints[0].pos) / 2;
				else
					rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos;
			}
			else
				rightUpPointX = catAx.labels.x;

			
			rightUpPointY = valAx.yPoints[valAx.yPoints.length - 1].pos;
			
			
			
			if(valAx.labels && !valAx.bDelete)
			{
				//подпись оси OY находится левее крайней левой точки
				if(leftDownPointX >= valAx.labels.x)
				{
					left = leftDownPointX - valAx.labels.x;
				}
				else if((valAx.labels.x + valAx.labels.extX) >= rightUpPointY)//правее крайней правой точки
				{
					right = valAx.labels.x + valAx.labels.extX - rightUpPointY;
				}
			}
			
			
			if(catAx.labels && !catAx.bDelete)
			{
				//подпись оси OX находится ниже крайней нижней точки
				if((catAx.labels.y + catAx.labels.extY) >= leftDownPointY)
				{
					bottom = (catAx.labels.y + catAx.labels.extY) - leftDownPointY;
				}
				else if(catAx.labels.y <= rightUpPointY)//выше верхней
				{
					top = rightUpPointY - catAx.labels.y;
				}
			}
			}
		
		
		return {left: left, right: right, top: top, bottom: bottom};
	},
	
	_getNullPosition: function()
	{
		var numNull = this.calcProp.numhlines;
			
		var min = this.calcProp.min;
		var max = this.calcProp.max;
		
		if(min >= 0 && max >= 0)
		{
			numNull = 0;
		}
		else if(min <= 0 && max <= 0)
		{
			numNull = this.calcProp.numhlines;
			if(this.calcProp.type == "HBar")
				numNull = this.calcProp.numvlines;
		}
		else
		{
			for (var i=0; i < this.calcProp.scale.length; i++)
			{
				if(this.calcProp.scale[i] == 0)
				{
					if(this.calcProp.type == "HBar")
						numNull = i;
					else
						numNull = i;
					break;
				}
			}
		}
		
		var nullPosition;
		if(0 == numNull)
			nullPosition = 0;
		else if(this.calcProp.type == "HBar")
			nullPosition = (this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right)/(this.calcProp.numvlines)*numNull;
		else
			nullPosition = (this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - this.calcProp.chartGutter._top)/(this.calcProp.numhlines)*numNull;
		
		var result;
		if(this.calcProp.type == "HBar")
			result = nullPosition + this.calcProp.chartGutter._left;
		else
			result = this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - nullPosition;
			
		return result;
	},
	
	_getScatterNullPosition: function()
	{
		var x, y;
		//OY
		for(var i = 0; i < this.calcProp.xScale.length; i++)
		{
			if(this.calcProp.xScale[i] == 0)
			{
				y = this.calcProp.chartGutter._left + i * (this.calcProp.trueWidth / (this.calcProp.xScale.length - 1));
				break;
			}
		}
		//OX
		for(var i = 0; i < this.calcProp.scale.length; i++)
		{
			if(this.calcProp.scale[i] == 0)
			{
				x = this.calcProp.heightCanvas - (this.calcProp.chartGutter._bottom + i * (this.calcProp.trueHeight / (this.calcProp.scale.length - 1)));
				break;
			}
		}
		return {x: x, y: y};
	},
	
	_getAxisData: function (max, mainObj, minVal, maxVal, yminVal, ymaxVal)
    {
        var greaterNullNum;
		
		if(( 'Bar' == mainObj.type || 'Line' == mainObj.type || 'Area' == mainObj.type) && mainObj.subType == 'stackedPer')
			return this._getLineAreaBarPercentAxisData(max, mainObj, minVal, maxVal, yminVal, ymaxVal);
		else if('Scatter' == mainObj.type || 'HBar' == mainObj.type)
			return this._getScatterHbarAxisData(max, mainObj, minVal, maxVal, yminVal, ymaxVal);
		else
			return this._getAnotherChartAxisData(max, mainObj, minVal, maxVal, yminVal, ymaxVal);
	},
	
	_getLineAreaBarPercentAxisData : function(max, mainObj, minVal, maxVal, yminVal, ymaxVal)
	{
		//*** LINE / BAR / AREA + 100% ****
		var arrNew =  mainObj.data;
		var newMin, newMax, massRes, min;
		
		if(typeof(arrNew[0]) == 'object')
		{
			var arrMin = [];
			var arrMax = [];
			for (var j=0; j < arrNew.length; j++) {
				newMax = 0;
				newMin = 0;
				if('Bar' == mainObj.type)
				{
					for (var i=0; i<arrNew[j].length; i++) {
						if(arrNew[j][i] > 0)
							newMax += arrNew[j][i]
						else
							newMin += arrNew[j][i]
					}
					arrMin[j] = newMin;
					arrMax[j] = newMax;
				}
				else
				{
					min = Math.min.apply(null, arrNew[j]);
					max = Math.max.apply(null, arrNew[j]);
					arrMin[j] = min;
					arrMax[j] = max;
				}
			   
			}
			min = Math.min.apply(null, arrMin);
			max = Math.max.apply(null, arrMax);
		}
		else
		{
			min = minVal;
			max = maxVal;
		}

		newMin = min;
		newMax  = max;
		
		//находим максимум после преобразования
		if('Bar' != mainObj.type)
		{
			 if(typeof(arrNew[0]) == 'object')
			{
				var arrMin = [];
				var arrMax = [];
				for (var j=0; j < arrNew.length; j++) {
					newMin = Math.min.apply(null, arrNew[j]);
					newMax = Math.max.apply(null, arrNew[j]);
					arrMin[j] = newMin;
					arrMax[j] = newMax;
				}
				newMin = Math.min.apply(null, arrMin);
				newMax = Math.max.apply(null, arrMax);
			}
			else
			{
				newMin = Math.min.apply(null, arrNew);
				newMax = Math.max.apply(null, arrNew);
			}
		}
	   
		if(max <= 0 && min < 0)
		{
			var tempVal = Math.abs(newMax)
			newMax = Math.abs(newMin);
			newMin = tempVal;
		}
		massRes = [];
		
		//шаг нужно высчитывать
		var step = 10;
		if(((newMax - newMin)/10) > 11 )
			step = 20;
		if('Bar' == mainObj.type  && max > 0 && min < 0)
			step = 20;
		var maxValue = 100;
		//находим максимум
		for (var i=0; i < 11; i++) {
			if(newMax < 100 - step*i && newMax > 100 - step*(i+1))
				maxValue = 100 - step*i;
		}
		if(maxValue > 100)
			maxValue = 100;
		//получаем массив
		if(max <= 0 && min < 0)
		{
			if('Bar' == mainObj.type)
			{
				for (var j=0; j < 11; j++) {
					massRes[j] = - (maxValue - step*j) / 100;
					if(massRes[j] == 0)
					{
						break;
					}
				}
				mainObj.xaxispos = 'top';
				mainObj.ymax = massRes[massRes.length - 1];
				mainObj.ymin = 0;
			}
			else
			{
				for (var j=0; j < 11; j++) {
					massRes[j] = -(maxValue - step*j) / 100;
					if(massRes[j] == 0)
					{
						break;
					}
				}
				mainObj.ymax = 0;
				mainObj.ymin = this._array_exp(massRes[0] - step);
			}
			
		}
		else if(max > 0 && min > 0)
		{
			for (var j=0; j < 11; j++) {
				massRes[j] = (maxValue - step*j) / 100;
				if(massRes[j] == 0)
				{
					massRes = this._array_reverse(massRes);
					break;
				}
			}
			mainObj.ymax = this._array_exp(maxValue);
			mainObj.ymin = this._array_exp(massRes[0] - step);
		}
		else
		{
			 for (var j=0; j < 11; j++) {
				massRes[j] = (maxValue - step*j) / 100;
				if(massRes[j] <= newMin / 100)
				{
					massRes = this._array_reverse(massRes);
					break;
				}
			}
			
			mainObj.ymax = this._array_exp(maxValue);
			mainObj.ymin = massRes[0] - step;
		}
	   
		return this._array_exp(massRes);
	},
	
	_getScatterHbarAxisData : function(max, mainObj, minVal, maxVal, yminVal, ymaxVal)
	{
		//*** SCATTER / HBAR ****
		var max1, min, greaterNullNum;
		var arr = [];

		//находим минимальное значение
		var min;
		var trueOX = false;
		if('HBar' == mainObj.type)
		{
			trueOX = true;
			if(typeof(mainObj.data[0]) == 'object')
			{
				var arrMin = [];
				var arrMax = [];
				for (var j=0; j < mainObj.data.length; j++) {
					min = Math.min.apply(null, mainObj.data[j]);
					max = Math.max.apply(null, mainObj.data[j]);
					arrMin[j] = min;
					arrMax[j] = max;
				}
				min = Math.min.apply(null, arrMin);
				max = Math.max.apply(null, arrMax);
			}
			else
			{
				min = Math.min.apply(null, mainObj.data);
				max = Math.max.apply(null, mainObj.data);
			}
		}
		
		//в этом случае определяем значения для оси OX(max == true)
		if(mainObj.type == 'Stock')
		{
			var arrTemp = []
			var k = 0;
			for (var j=0; j < mainObj.data[0].length; j++) {
				for (var i=0; i<5; i++)
				{
					arrTemp[k] = mainObj.data[0][j][1][i];
					k++;
				}
			}
			min = Math.min.apply(null, arrTemp);
			max = Math.max.apply(null, arrTemp);
			if(min == max && max == 0)
			{
				mainObj._otherProps._ymax = 1;
				mainObj._otherProps._ymin = 0;
				return [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
			}
			
			if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
				return [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
		}
		if('Scatter' == mainObj.type)
		{
			if(undefined != max && true == max)
			{
				min  = minVal;
				max  =  maxVal;
				trueOX = true;
			}
			else
			{
				min = yminVal;
				max = ymaxVal;
			}
			if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
				return [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
		}

		var degreeNum = 1;
		var maxString = max.toExponential();
		var minString = min.toExponential();
		var floatKoff = 1000000000000;
		if(maxString.search('e-') != -1 || minString.search('e-') != -1)
		{
			var partMin  = minString.split('e-');
			var partMax  = maxString.split('e-');
			if(partMin[1] != undefined)
				degreeNum = Math.pow(10, partMin[1])
			if(partMax[1] != undefined && ((parseFloat(partMin[1]) < parseFloat(partMax[1])) || partMin[1] == undefined))
				degreeNum = Math.pow(10, partMax[1])	
			max = this._round_val(max*degreeNum);
			min = this._round_val(min*degreeNum);
		}
		
		var axisXMax;
		var axisXMin;
		var stepOY;
		var checkInput = false;
		var greaterNull;
		var chackBelowNull = false;
		var checkIsMaxMin = false;
		var arrForRealDiff = [];
		if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
		{
			if( mainObj.subType == 'stackedPer')
				return [20, 40, 60, 80, 100];
			else
				return [0.2, 0.4, 0.6, 0.8, 1, 1.2];
		}
				
		//подготовительная работы для дальнейшего вычисления шага
		if(max >= 0 && min >= 0)
		{
			 if(max == min)
			{
				checkIsMaxMin = true;
				min = 0;
			}
				
			var diffPerMaxMin = ((max - min)/max)*100;
			 axisXMax =  max + 0.05 * (max - min);
			stepOY = (max-min)/4;
			if(16.667 > diffPerMaxMin)
			{
				if(trueOX)
				{
					axisXMin = min;
					greaterNull = (max - min)/4;
					arrForRealDiff = [1.59595959, 3.18181818, 7.954545454];
				}
				else
				{
					axisXMin = min;
					greaterNull = (max - min)/6;
					arrForRealDiff = [1.51515151, 3.03030303, 7.57575757];
				}
			}
			else
			{
				if(trueOX)
				{
					greaterNull = max/4;
					arrForRealDiff = [1.66666666, 3.33333333, 8.33333333];
					axisXMin = 0;
				}
				else
				{
					axisXMin = 0;
				}
			}
		}
		else if(max <= 0 && min <= 0)
		{
			if(max == min)
			{
				checkIsMaxMin = true;
				max = 0;
			}
			var tempMax = max;
			if(!trueOX)
				mainObj.xaxispos = 'top';
			else
				mainObj.yaxispos = 'right';
			max = Math.abs(min);
			min = Math.abs(tempMax);
			checkInput = true;
			var diffPerMaxMin = Math.abs(((max - min)/max))*100;
			axisXMax =  max;
			stepOY = (max-min)/4;
			chackBelowNull = true;
			if(16.667 > diffPerMaxMin)
			{
				axisXMin = min;
				greaterNull = Math.abs((Math.abs(max) - Math.abs(min)))/6;
				arrForRealDiff = [1.51515151, 3.03030303, 7.57575757];
			}
			else
			{
				if(trueOX)
				{
					greaterNull = max/4;
					arrForRealDiff = [1.66666666, 3.33333333, 8.33333333];
					axisXMin = 0;
				}
				else
				{
					axisXMin = 0;
				}
			}
		}
		else if(max > 0 && min < 0)
		{
			stepOY = (max + Math.abs(min))/4;
			axisXMax = max;
			axisXMin = min;
			if(trueOX)
			{
				greaterNull = (Math.abs(max) + Math.abs(min))/4;
				arrForRealDiff = [1.59090909, 3.18181818, 7.954545454]
			}
			else
			{
				greaterNull = Math.abs((Math.abs(max) + Math.abs(min)))/6;
				arrForRealDiff = [1.51515151, 3.03030303, 7.57575757]
			}
		}
		
		
		
		
		//приводим к первому порядку для дальнейших вычислений
		var secPart = max.toString().split('.');
		var numPow = 1;
		if(secPart[1] && secPart[1].toString().search('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
		{
			var expNum = secPart[1].toString().split('e+');
			numPow = Math.pow(10, expNum[1]);
		}
		else if(0 != secPart[0])
			numPow = Math.pow(10, secPart[0].toString().length - 1)
		max = max/numPow;
		if(0 == max.toString().split('.')[0])
		{
			var tempMax = max;
			var num = -1;
			while(0 == tempMax.toString().split('.')[0])
			{
				tempMax = max;
				numPow = Math.pow(10, num);
				tempMax = tempMax/numPow;
				num--;
			}
			max = tempMax;
		}
		
		
		var stepOYPart = stepOY.toString().split('.');
		var numPowOY;
		var tempVal;
		
		if(0 != stepOYPart[0])
			numPowOY = Math.pow(10, stepOYPart[0].toString().length - 1)
		if(10 == stepOYPart[0])
			numPowOY = 1;
		if(0 == stepOYPart[0])
		{
			var tempMax = stepOY;
			var num = -1;
			while(0 == tempMax.toString().split('.')[0])
			{
				tempMax = stepOY;
				numPowOY = Math.pow(10, num);
				tempMax = tempMax/numPowOY;
				num--;
			}
		}
		
		
		//поиск шага
		if(undefined != greaterNull)
		{
			 var greaterNullTemp = greaterNull.toString().split('.');
			if(0 != greaterNullTemp[0])
				greaterNullNum = Math.pow(10, greaterNullTemp[0].toString().length - 1)
			if(0 == greaterNullTemp[0])
			{
				var tempMax = greaterNull;
				var num = -1;
				while(0 == tempMax.toString().split('.')[0])
				{
					tempMax = greaterNull;
					greaterNullNum = Math.pow(10, num);
					tempMax = tempMax/greaterNullNum;
					num--;
				}
			}
			else if(greaterNull.toString().indexOf("e+") > -1)
			{
				var splitString = greaterNull.toString().split("e+");
				if(splitString[1])
					greaterNullNum = Math.pow(10, parseFloat(splitString[1]));
			}
			
			greaterNull = greaterNull/greaterNullNum;

				 if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
					greaterNull = 1;
				else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
					greaterNull = 2;
				else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
					greaterNull = 5;
				else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
					greaterNull = 10;
		   
			greaterNull = greaterNull*greaterNullNum;
			stepOY = greaterNull;
		}
		
		arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
		//если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
		var arrMaxVal = [0, 0.952380952, 1.904761904, 4.76190476, 9.523809523]
		//массив диапазонов
		var arrDiffVal1 = [0, 0.2, 0.5, 1, 2]
		if(axisXMin == 0 && undefined == greaterNull)//если разница между min и max такая, что не нужно масштабировать
		{
			var trueDiff = 1;
			for (var i=0; i<arr.length; i++) {
				if( max >= arr[i] && max <= arr[i+1])
				{
					var max1 = arr[i+1];
					var trueMax;
					var diff = max1/10;
					trueDiff = diff;
					var maxVal;
					//проверяем есть ли переход в следующий диапазон
					if(max > arrMaxVal[i+1])
					{
						trueDiff = arrDiffVal1[i+1]
					}
				}
			}
			stepOY = trueDiff*numPow;
		}
		
		if('HBar' == mainObj.type && mainObj.subType == 'stackedPer')
		{
			if(axisXMin < 0 && axisXMax > 0)
			{
				var summVal = Math.abs(axisXMin) + Math.abs(axisXMax)
				if(summVal <= 100)
					stepOY  = 10;
				else if(summVal > 100 && summVal <= 139)
					stepOY  = 20;
				else
					stepOY  = 50;
			}
			else
			{
				stepOY  = 20;
			}
		}
		
		//находим истинные min и max
		var testDiff;
		var axisXMinTest;
		if(axisXMin == 0)
		{
			testDiff = stepOY/numPow;
			axisXMinTest = axisXMin/numPow
		}
		else
		{
			testDiff = stepOY/numPowOY;
			axisXMinTest = axisXMin/numPowOY;
		}
		var tempNum;
		var countAfterPoint = 1;
		
		if(undefined != axisXMinTest.toString().split('.')[1])
		{
			countAfterPoint = Math.pow(10, axisXMinTest.toString().split('.')[1].toString().length - 1)
		}
		
		if(1 == testDiff)
			tempNum = testDiff/4;
		else if(2 == testDiff)
			tempNum = testDiff/4;
		else if(5 == testDiff)
			tempNum = testDiff/10;
		else if(10 == testDiff)
			tempNum = testDiff/20;
		axisXMinTest = Math.floor(axisXMinTest);
		while(0 != axisXMinTest%testDiff)
		{
			axisXMinTest = axisXMinTest - tempNum;
		}

		
		
		//возвращаем массив
		var varMin = axisXMinTest*numPowOY;
		var massRes = [];
		var tempKoff = 100000000000;
		varMin = this._round_val(varMin);


		var lengthNum;
		if(!trueOX)
		{
			
			if(chackBelowNull)
			{
				if(min == varMin && !checkIsMaxMin && min != 0 )
					varMin = varMin - stepOY ;
				varMin = varMin/degreeNum;
				stepOY = stepOY/degreeNum;
				axisXMax = axisXMax/degreeNum;
				max = max/degreeNum;
				if(undefined != varMin.toString().split('.')[1])
					lengthNum = varMin.toString().split('.')[1].length;
				for (var k=0; k <= 11; k++) {
					massRes[k] =  - this._round_val(varMin + (k)*(stepOY));
					if(Math.abs(massRes[k]) > axisXMax)
					{
						break;
					}
				
				}
				/*if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
					massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
				
				
				
				mainObj.ymax = -massRes[0];
				mainObj.ymin = -massRes[massRes.length - 1];*/
				
				massRes = this._array_reverse(massRes);
				//mainObj.max = -massRes[0];
			}
			else
			{
				if(min == varMin && !checkIsMaxMin)
					varMin = varMin - stepOY ;
				if(undefined != varMin.toString().split('.')[1])
					lengthNum = varMin.toString().split('.')[1].length;
				
				 varMin = varMin/degreeNum;
				stepOY = stepOY/degreeNum;
				axisXMax = axisXMax/degreeNum;
				max = max/degreeNum;
				
				if(min == 0 && (mainObj.type == 'Stock' || mainObj.type == 'Scatter'))
					varMin = 0;
				if(max == 0 && mainObj.type == 'Stock')
					axisXMax = 0 + stepOY;
				for (var k=0; k <= 11; k++) {
					massRes[k] = this._round_val(varMin + (k)*(stepOY));
					if(massRes[k] > axisXMax)
					{
						break;
					}
				
				}
				if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
					massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
				//mainObj.max =  massRes[massRes.length - 1];
				mainObj.ymax = massRes[massRes.length - 1];
				mainObj.ymin = massRes[0];
			}
		}
		else
		{
			if(chackBelowNull)
			{
				if(min == varMin && !checkIsMaxMin && min != 0)
					varMin = varMin - stepOY ; 
				if(undefined != varMin.toString().split('.')[1])
					lengthNum = varMin.toString().split('.')[1].length;
				varMin = varMin/degreeNum;
				stepOY = stepOY/degreeNum;
				axisXMax = axisXMax/degreeNum;	
				max = max/degreeNum;
				for (var k=0; k <= 11; k++) {
					massRes[k] =  - this._round_val(varMin + (k)*(stepOY));
					if('HBar' == mainObj.type && mainObj.subType == 'stackedPer')
					{
						massRes[k] = massRes[k] / 100;
						if(Math.abs(massRes[k]) >= axisXMax / 100)
						{
							break;
						}
					}
					else
					{
						if(Math.abs(massRes[k]) > axisXMax)
						{
							break;
						}
					}
				
				}
				/*if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
					massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
				
				mainObj.xmax = -massRes[0];
				mainObj.xmin = -massRes[massRes.length - 1];*/
				massRes = this._array_reverse(massRes);
			}
			else
			{
				if(min == varMin && !checkIsMaxMin &&  'HBar' != mainObj.type && mainObj.subType != 'stackedPer')
					varMin = varMin - stepOY ;
				if(undefined != varMin.toString().split('.')[1])
					lengthNum = varMin.toString().split('.')[1].length; 
				
				 varMin = varMin/degreeNum;
				stepOY = stepOY/degreeNum;
				axisXMax = axisXMax/degreeNum;
				max = max/degreeNum;
				for (var k=0; k <= 11; k++) {
					massRes[k] = this._round_val(parseFloat(varMin + (k)*(stepOY)));
					if('HBar' == mainObj.type && mainObj.subType == 'stackedPer')
					{
						massRes[k] = massRes[k] / 100;
						if(massRes[k] >= axisXMax / 100 || massRes[k] >= 1)
						{
							break;
						}
					}
					else
					{
						if(massRes[k] > axisXMax)
						{
							break;
						}
					}
				}
				
				if(massRes[massRes.length - 1] == max && !checkIsMaxMin && !('HBar' == mainObj.type && mainObj.subType == 'stackedPer'))
					massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
				
				mainObj.xmax = massRes[massRes.length - 1];
				mainObj.xmin = massRes[0];
				mainObj.xmax = massRes[massRes.length - 1];
			}
		}
		if('hbar' == mainObj.type)
		{
			massRes.splice(0,1);
		}
		return this._array_exp(massRes);
	},
		
	_getAnotherChartAxisData : function(max, mainObj, minVal, maxVal, yminVal, ymaxVal)
	{
		//***ANOTHER CHARTS***
		var max1;
		var arr = [];
		//находим минимальное значение
		var min, max, greaterNullNum;
		if('Bar' == mainObj.type)
		{
			if(mainObj.subType == 'stacked')
			{
				//суммируем отрицательные и положительные значения
				if(typeof(mainObj.data[0]) == 'object')
				{
					var arrMin = [];
					var arrMax = [];
					for (var j=0; j < mainObj.data.length; j++) {
						var allHeightAbNull = 0;
						var allHeightLessNull = 0;
						for (var i=0; i < mainObj.data[j].length; i++) 
							{
								
								if(mainObj.data[j][i] > 0)
									allHeightAbNull += mainObj.data[j][i];
								else
									allHeightLessNull += mainObj.data[j][i];
							}
							arrMin[j] = allHeightLessNull;
							arrMax[j] = allHeightAbNull;
					}
					min = Math.min.apply(null, arrMin);
					max = Math.max.apply(null, arrMax);
				}
				else
				{
					min = Math.min.apply(null, mainObj.data);
					max = Math.max.apply(null, mainObj.data);
				}
			}
			else
			{
				min = minVal;
				max = maxVal;
			}
		}
		else
		{
			if(('Line' == mainObj.type && mainObj.subType == 'stacked' ) || 'Line' != mainObj.type )
			{
				var arrMin = [];
				var arrMax = [];
				for (var j=0; j<mainObj.data.length; j++) {
					min = Math.min.apply(null, mainObj.data[j]);
					max = Math.max.apply(null, mainObj.data[j]);
					arrMin[j] = min;
					arrMax[j] = max;
				}	
				min = Math.min.apply(null, arrMin);
				max = Math.max.apply(null, arrMax);
			}
			else
			{	
				min = minVal;
				max = maxVal;
			}
		}
		
		if(max == min)
		{
			if(max > 0)
				min = 0;
			else if(max < 0)
				max = 0;
		}
		
		var degreeNum = 1;
		var maxString = max.toExponential();
		var minString = min.toExponential();
		var floatKoff = 10000000000;
		if(maxString.search('e-') != -1 || minString.search('e-') != -1)
		{
			var partMin  = minString.split('e-');
			var partMax  = maxString.split('e-');
			if(partMin[1] != undefined)
				degreeNum = Math.pow(10, partMin[1])
			if(partMax[1] != undefined && (parseFloat(partMin[1]) < parseFloat(partMax[1])))
				degreeNum = Math.pow(10, partMax[1])	
			max = this._round_val(max*degreeNum);
			min = this._round_val(min*degreeNum);
		}
		
		
		var axisXMax;
		var axisXMin;
		var stepOY;
		var checkInput = false;
		var greaterNull;
		var firstMax = max;
		var firstMin = min;
		
		
		var arrForRealDiff = [];
		if(max >= 0 && min >= 0)
		{
			var diffPerMaxMin = ((max - min)/max)*100;
			 axisXMax =  max + 0.05 * (max - min);
			stepOY = (max-min)/4;
			if(16.667 > diffPerMaxMin)
			{
				axisXMin = min - ((max - min) / 2);
				greaterNull = (max - min)/4;
				arrForRealDiff = [1.5873, 3.1745, 7.93651]
			}
			else
			{
				axisXMin = 0;
			}
		}
		else if(max <= 0 && min <= 0)
		{
			var tempMax = max;
			mainObj.xaxispos = 'top';
			max = Math.abs(min);
			min = Math.abs(tempMax);
			checkInput = true;
			var diffPerMaxMin = ((max - min)/max)*100;
			 axisXMax =  max + 0.05 * (max - min);
			stepOY = (max-min)/4;
			if(16.667 > diffPerMaxMin)
			{
				axisXMin = min - ((max - min) / 2);
				greaterNull = (max - min)/4;
				arrForRealDiff = [1.5873, 3.1745, 7.93651]
			}
			else
			{
				axisXMin = 0;
			}
		}
		else if(max > 0 && min < 0)
		{
			stepOY = (max + Math.abs(min))/4;
			axisXMax = max + 0.05 * (max - min);
			axisXMin = min + 0.05 * (min - max);
			greaterNull = (Math.abs(max) + Math.abs(min))/6;
			arrForRealDiff = [1.51515151, 3.03030303, 7.57575757]
		}
		
		
		//приведение к первому порядку для дальнейших вычислений
		var secPart = max.toString().split('.');
		var numPow = 1;
		if(secPart[1] && secPart[1].toString().search('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
		{
			var expNum = secPart[1].toString().split('e+');
			numPow = Math.pow(10, expNum[1]);
		}
		else if(0 != secPart[0])
			numPow = Math.pow(10, secPart[0].toString().length - 1)
		max = max/numPow;
		if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
				return [0.2, 0.4, 0.6, 0.8, 1, 1.2];
		if(0 == max.toString().split('.')[0])
		{
			var tempMax = max;
			var num = -1;
			while(0 == tempMax.toString().split('.')[0])
			{
				tempMax = max;
				numPow = Math.pow(10, num);
				tempMax = tempMax/numPow;
				num--;
			}
			max = tempMax;
		}
		
		
		var stepOYPart = stepOY.toString().split('.');
		var numPowOY;
		var tempVal;
		
		if(0 != stepOYPart[0])
			numPowOY = Math.pow(10, stepOYPart[0].toString().length - 1)
		if(10 == stepOYPart[0])
			numPowOY = 1;
		if(0 == stepOYPart[0])
		{
			var tempMax = stepOY;
			var num = -1;
			while(0 == tempMax.toString().split('.')[0])
			{
				tempMax = stepOY;
				numPowOY = Math.pow(10, num);
				tempMax = tempMax/numPowOY;
				num--;
			}
		}
		
		
		//поиск шага
		if(undefined != greaterNull)
		{
			 var greaterNullTemp = greaterNull.toString().split('.');
			if(0 != greaterNullTemp[0])
				greaterNullNum = Math.pow(10, greaterNullTemp[0].toString().length - 1)
			if(0 == greaterNullTemp[0])
			{
				var tempMax = greaterNull;
				var num = -1;
				while(0 == tempMax.toString().split('.')[0])
				{
					tempMax = greaterNull;
					greaterNullNum = Math.pow(10, num);
					tempMax = tempMax/greaterNullNum;
					num--;
				}
			}
			
			greaterNull = greaterNull/greaterNullNum;
			if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
				greaterNull = 1;
			else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
				greaterNull = 2;
			else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
				greaterNull = 5;
			else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
				greaterNull = 10;
			greaterNull = greaterNull*greaterNullNum;
			stepOY = greaterNull;
		}
		
		arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
		//если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
		var arrMaxVal = [0, 0.952380952, 1.904761904, 4.76190476, 9.523809523]
		//массив диапазонов
		var arrDiffVal1 = [0,0.2,0.5,1,2]
		if(axisXMin == 0)//если разница между min и max такая, что не нужно масштабировать
		{
			var trueDiff = 1;
			for (var i=0; i<arr.length; i++) {
				if( max >= arr[i] && max <= arr[i+1])
				{
					var max1 = arr[i+1];
					var trueMax;
					var diff = max1/10;
					trueDiff = diff;
					var maxVal;
					//проверяем есть ли переход в следующий диапазон
					if(max > arrMaxVal[i+1])
					{
						trueDiff = arrDiffVal1[i+1]
					}
				}
			}
			stepOY = trueDiff*numPow;
		}
		
		
		stepOY = this._round_val(stepOY);
		
		
		
		//находим истинные min и max
		var testDiff;
		var axisXMinTest;
		if(axisXMin == 0)
		{
			testDiff = stepOY/numPow;
			axisXMinTest = axisXMin/numPow
		}
		else
		{
			testDiff = stepOY/numPowOY;
			axisXMinTest = axisXMin/numPowOY;
		}
		var tempNum;
		var countAfterPoint = 1;
		
		if(undefined != axisXMinTest.toString().split('.')[1])
		{
			countAfterPoint = Math.pow(10, axisXMinTest.toString().split('.')[1].toString().length - 1)
		}
		var floatKoff = 10000000000;
		if(0.5 == testDiff)
			tempNum = testDiff/5;
		else if(1 == testDiff)
			tempNum = testDiff/4;
		else if(2 == testDiff)
			tempNum = testDiff/4;
		else if(5 == testDiff)
			tempNum = testDiff/10;
		else
			tempNum = testDiff/20;
		if(testDiff != 0.5)
			axisXMinTest = Math.floor(axisXMinTest);
		else
		{
			axisXMinTest = Math.round(axisXMinTest*100)/100;
			if(axisXMinTest.toString().split('.')[1] != undefined)
			{
				var lengthAfterPoint = axisXMinTest.toString().split('.')[1].length;
				var l = 0;
				while(axisXMinTest.toString().split('.')[1].length != 1)
				{
					axisXMinTest = axisXMinTest - Math.pow(10,-(lengthAfterPoint));
					if(l > 9)
					{
						axisXMinTest = Math.floor(axisXMinTest);
						break;
					}
					l++;
				}
			}
			
		}
			
		while(0 != axisXMinTest%testDiff)
		{
			axisXMinTest = axisXMinTest - tempNum;
			if(testDiff == 0.5)
			{
				axisXMinTest = this._round_val(axisXMinTest);
			}
		}

		
		
		//возвращаем массив
		var varMin = axisXMinTest*numPowOY;
		var massRes = [];
		
		var tempKoff = 100000000000000;
		varMin = this._round_val(varMin);
		if(undefined != varMin.toString().split('.')[1])
			lengthNum = varMin.toString().split('.')[1].length;

		if('Line' == mainObj.type && max > 0 && min < 0)
		{
			varMin = varMin/degreeNum;
			stepOY = stepOY/degreeNum;
			axisXMax = axisXMax/degreeNum;
			for (var k=0; k <= 11; k++) {
				massRes[k] = this._round_val((parseFloat(varMin + (k)*(stepOY))));
				if(massRes[k] > axisXMax)
				{
					break;
				}
		
			}
		}
		else
		{
			varMin = varMin/degreeNum;
			stepOY = stepOY/degreeNum;
			axisXMax = axisXMax/degreeNum;
			for (var k=0; k <= 11; k++) {
				massRes[k] = this._round_val((varMin + (k)*(stepOY)));
				if(minVal < 0 && maxVal <= 0)
				{
					massRes[k] = - massRes[k];
					if(Math.abs(massRes[k]) > axisXMax)
					{
						break;
					}
				}
					
				if(massRes[k] > axisXMax)
				{
					break;
				}
			}
			if(minVal < 0 && maxVal <= 0)
				massRes = this._array_reverse(massRes);
		}
		
		if('line' == mainObj.type && max > 0 && min < 0)
		{
			mainObj.ymax = massRes[massRes.length - 1];
			mainObj.ymin = this._round_val(this._array_exp(massRes[0] - stepOY));
		}
		else
		{
			mainObj.ymax = massRes[massRes.length - 1];
			mainObj.ymin = this._round_val(this._array_exp(massRes[0] - stepOY));
		}
		return this._array_exp(massRes);
	},
	
	_round_val: function (num)
	{
		if(num.toString() && num.toString().indexOf('e+') == -1 && isNaN(parseFloat(num)))
			return num;
		var floatKoff = 100000000000;
		if(num.toString() && num.toString().indexOf('e+') > -1)
		{
			var parseVal = num.toString().split("e+");
			var roundVal = Math.round(parseFloat(parseVal[0])*floatKoff)/floatKoff;
			var changeSymbol = roundVal.toString() + "e+" + parseVal[1];
			num = parseFloat(changeSymbol);
		}
		num =  Math.round(num*floatKoff)/floatKoff ;
		return num;
	},
	
	_array_exp: function (arr)
    {
		var maxDig = 1000000000;
		var minDig = 0.000000001;
		var floatKoff = 100000000000;
		
		if(typeof(arr) == 'number')
		{
			if(arr < 0)
				maxDig = 100000000;
			if(Math.abs(arr) > maxDig)
			{
				var tmp = Math.abs(arr);
				var exp = 0;
				while (tmp > 9) {
					exp += 1;
					tmp /= 10;
				}
				if(arr < 0)
					tmp *= -1; 
				arr = tmp + "E+" + exp;
			}
		}
		else
		{
			for (var i=0; i<arr.length; ++i) {
			maxDig = 1000000000
			if(arr[i] < 0)
				maxDig = 100000000;
				if(Math.abs(arr[i]) > maxDig)
				{
					var tmp = Math.abs(arr[i]);
					var exp = 0;
					while (tmp > 9) {
						exp += 1;
						tmp /= 10;
					}
					tmp = Math.round(tmp*floatKoff)/floatKoff
					if(arr[i] < 0)
						tmp *= -1; 
					arr[i] = tmp + "E+" + exp;
				}
			}
		}
		return arr;
	},
	
	_array_reverse: function (arr)
    {
        var newarr = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newarr.push(arr[i]);
        }
        return newarr;
    },
	
	_convert3DTo2D: function(x, y, z, p, q, r)
	{
		var convertMatrix = [[1, 0, 0, p], [0, 1, 0, q], [0, 0, 0, r], [0, 0, 0, 1]];
		
		var qC = x * convertMatrix[0][3] + y * convertMatrix[1][3] + z * convertMatrix[2][3] + 1;
		var newX = (x * convertMatrix[0][0] + y * convertMatrix[1][0] + z * convertMatrix[2][0] - 0)/(qC);
		var newY = (x * convertMatrix[0][1] + y * convertMatrix[1][1] + z * convertMatrix[2][1] - 0)/(qC);
		return {x: newX, y: newY};
	},
	
	_turnCoords: function(x, y, z, angleOX, angleOY, angleOZ)
	{
		var newX, newY, newZ;
		
		//around OY
		newX = x * Math.cos(angleOY) - z * Math.sin(angleOY);
		newY = y;
		newZ = x * Math.sin(angleOY) + z * Math.cos(angleOY);
		
		//around OX
		newX = newX;
		newY = newY * Math.cos(angleOX) + newZ * Math.sin(angleOX);
		newZ = newZ * Math.cos(angleOX) - newY * Math.sin(angleOX);
		
		//around OZ
		newX = newX * Math.cos(angleOZ) + newY * Math.sin(angleOZ);
		newY = newY * Math.cos(angleOZ) - newX * Math.sin(angleOZ);
		newZ = newZ;
		
		return {x: newX,y: newY,z: newZ};
	}
}



//*****BAR CHART*****
function drawBarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
	this.summBarVal = [];
}

drawBarChart.prototype =
{
    reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.paths = {};
		this.summBarVal = [];
		
		this._reCalculateBars();
	},
	
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;

		this._DrawBars();
	},
	
	_DrawBars: function()
	{
		var brush, pen, seria;
		for (var i = 0; i < this.paths.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;

			for (var j = 0; j < this.paths.series[i].length; j++) {
				if(seria.val.numRef.numCache.pts[j].pen)
					pen = seria.val.numRef.numCache.pts[j].pen;
				if(seria.val.numRef.numCache.pts[j].brush)
					brush = seria.val.numRef.numCache.pts[j].brush;
					
				this._drawPaths(this.paths.series[i][j], brush, pen);
			}
		}
	},
	
	_reCalculateBars: function (/*isSkip*/)
    {
        //соответствует подписям оси категорий(OX)
		var xPoints = this.cShapeDrawer.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cShapeDrawer.chart.plotArea.valAx.yPoints;
		
		var xaxispos      = this.chartProp.xaxispos;
		var widthGraph    = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;
		
		//TODO - передавать overlap из меню!
		var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
		var overlap        = this.cShapeDrawer.chart.plotArea.chart.overlap ? this.cShapeDrawer.chart.plotArea.chart.overlap : defaultOverlap;
        var width          = widthGraph / this.chartProp.series[0].val.numRef.numCache.pts.length;
		
		
		var individualBarWidth = width / (this.chartProp.series.length - (this.chartProp.series.length - 1) * (overlap / 100) + this.cShapeDrawer.chart.plotArea.chart.gapWidth / 100);
		var widthOverLap = individualBarWidth * (overlap / 100);
		var hmargin = (this.cShapeDrawer.chart.plotArea.chart.gapWidth / 100 * individualBarWidth) / 2;
		
		var height, startX, startY, diffYVal, val, paths, seriesHeight = [], seria, startYColumnPosition, startXPosition;
		
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i].val.numRef.numCache.pts;
			seriesHeight[i] = [];
			
			for (var j = 0; j < seria.length; j++) {
				
				//стартовая позиция колонки Y(+ высота с учётом поправок на накопительные диаграммы)
				val = parseFloat(seria[j].val);
				startYColumnPosition = this._getStartYColumnPosition(seriesHeight, j, val, yPoints);
				startY = startYColumnPosition.startY;
				height = startYColumnPosition.height;

				seriesHeight[i][j] = height;
				
				//стартовая позиция колонки X
				if(j != 0)
					startXPosition = xPoints[j].pos - (xPoints[j].pos - xPoints[j - 1].pos) / 2;
				else
					startXPosition = this.cShapeDrawer.chart.plotArea.valAx.posX;
				if(i == 0)
					startX = startXPosition * this.chartProp.pxToMM + hmargin + i * (individualBarWidth);
				else
					startX = startXPosition * this.chartProp.pxToMM + hmargin + (i * individualBarWidth - i * widthOverLap);
				
				if(height != 0)
				{
					paths = this._calculateRect(startX, startY, individualBarWidth, height);
					
					if(!this.paths.series)
						this.paths.series = [];
					if(!this.paths.series[i])
						this.paths.series[i] = [];
					this.paths.series[i][j] = paths;
				}
			}
        }
    },
	
	
	_getStartYColumnPosition: function (seriesHeight, j, val, yPoints, summBarVal)
	{
		var startY, diffYVal, height;
		var nullPositionOX = this.chartProp.nullPositionOX/*this.cShapeDrawer.chart.plotArea.catAx.posY * this.chartProp.pxToMM*/;
		if(this.chartProp.subType == "stacked")
		{
			diffYVal = 0;
			for(var k = 0; k < seriesHeight.length; k++)
			{
				if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0)))
					diffYVal += seriesHeight[k][j];
			}
			startY = nullPositionOX - diffYVal;
			height = nullPositionOX - this._getYPosition(val, yPoints) * this.chartProp.pxToMM;
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			diffYVal = 0;
			for(var k = 0; k < seriesHeight.length; k++)
			{
				if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0)))
					diffYVal += seriesHeight[k][j];
			}
			
			var tempVal;
			var temp = 0;
			if(!this.summBarVal[j])
			{
				for(var k = 0; k < this.chartProp.series.length; k++)
				{
					tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[j].val);
					if(tempVal)
						temp += Math.abs(tempVal);
				}
				this.summBarVal[j] = temp;
			}
			
			height = nullPositionOX - this._getYPosition((val / this.summBarVal[j]), yPoints) * this.chartProp.pxToMM;
			startY = nullPositionOX - diffYVal;
		}
		else
		{
			height = nullPositionOX - this._getYPosition(val, yPoints) * this.chartProp.pxToMM;
			startY = nullPositionOX;
		}	
		
		return {startY : startY, height: height};
	},
	
	_getYPosition: function(val, yPoints)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		for(var s = 0; s < yPoints.length; s++)
		{
			if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
			{
				resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
				resVal = yPoints[s + 1].val - yPoints[s].val;
				result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
				break;
			}
		}
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		var path = this.paths.series[ser][val].ArrPathCommand;
			
		var x = path[0].X;
		var y = path[0].Y;
		
		var h = path[0].Y - path[1].Y;
		var w = path[2].X - path[1].X;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX, centerY;
				
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h/2 - height/2;
				break;
			}
			case DLBL_POS_IN_BASE:
			{
				centerX = x + w/2 - width/2;
				centerY = y;
				if(point.val > 0)
					centerY = y - height;
				break;
			}
			case DLBL_POS_IN_END:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h;
				if(point.val < 0)
					centerY = centerY - height;	
				break;
			}
			case DLBL_POS_OUT_END:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h - height;
				if(point.val < 0)
					centerY = centerY + height;	
				break;
			}
		}
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
		
		return {x: centerX, y: centerY};
	},
	
	_calculateRect : function(x, y, w, h)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	}, 
	
	_drawPaths: function(paths, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		cGeometry.AddPath(paths);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****LINE CHART*****
function drawLineChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawLineChart.prototype =
{
    draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawLines();
	},
	
	reCalculate : function(chartProp, cChartSpace)
    {
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cChartSpace = cChartSpace;
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var y, y1, x, x1, val, nextVal, tempVal, seria, dataSeries;
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i];
			
			dataSeries = seria.val.numRef.numCache.pts;
			
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				//рассчитываем значения				
				val = this._getYVal(n, i);
				nextVal = this._getYVal(n + 1, i);
				
				//точки находятся внутри диапазона

				y  = this._getYPosition(val, yPoints);
				y1 = this._getYPosition(nextVal, yPoints);
				
				x  = xPoints[n].pos; 
				x1 = xPoints[n + 1].pos;
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = []
				
				this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
			}
		}
	},
	
	_getYPosition: function(val, yPoints)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - (diffVal / resVal) * resPos;
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					break;
				}
			}
		}
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		var path;
		
		if(val == this.chartProp.series[ser].val.numRef.numCache.pts.length - 1)
			path = this.paths.series[ser][val - 1].ArrPathCommand[1];
		else
			path = this.paths.series[ser][val].ArrPathCommand[0];
			
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_B:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				break;
			}
			case DLBL_POS_L:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case DLBL_POS_R:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case DLBL_POS_T:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_drawLines: function (isRedraw/*isSkip*/)
    {
		var brush;
		var pen;
		var dataSeries;
		var seria;
		
		this.cShapeDrawer.Graphics.SaveGrState();
		this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, this.chartProp.chartGutter._top / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		for (var i = 0; i < this.chartProp.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			dataSeries = seria.val.numRef.numCache.pts;
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				if(seria.val.numRef.numCache.pts[n].pen)
					pen = seria.val.numRef.numCache.pts[n].pen;
				if(seria.val.numRef.numCache.pts[n].brush)
					brush = seria.val.numRef.numCache.pts[n].brush;
					
				this._drawPath(this.paths.series[i][n], brush, pen);
			}
        }
		this.cShapeDrawer.Graphics.RestoreGrState();
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= i; k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
				{
					if(k <= i)
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val / summVal;
		}
		else
		{
			val = parseFloat(this.chartProp.series[i].val.numRef.numCache.pts[n].val);
		}
		return val;
	},
	
	_calculateLine : function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		path.stroke = true;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****AREA CHART*****
function drawAreaChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
}

drawAreaChart.prototype =
{
    
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawLines();
	},
	
	reCalculate : function(chartProp, cChartSpace)
    {
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cChartSpace = cChartSpace;
		this._calculateLines(true);
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var y, y1, x, x1, val, nextVal, tempVal, seria, dataSeries;
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i];
			
			dataSeries = seria.val.numRef.numCache.pts;
			
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				//рассчитываем значения				
				val = this._getYVal(n, i);
				nextVal = this._getYVal(n + 1, i);
				
				//точки находятся внутри диапазона
				if(val >= yPoints[0].val && val <= yPoints[yPoints.length - 1].val && nextVal >= yPoints[0].val && nextVal <= yPoints[yPoints.length - 1].val)
				{
					y  = this._getYPosition(val, yPoints);
					y1 = this._getYPosition(nextVal, yPoints);
					
					x  = xPoints[n].pos; 
					x1 = xPoints[n + 1].pos;
				}
				//первая точка выходит за пределы диапазона || вторая точка выходит за пределы диапазона
				else if(( nextVal >= yPoints[0].val && nextVal <= yPoints[yPoints.length - 1].val ) || ( val >= yPoints[0].val && val <= yPoints[yPoints.length - 1].val ))
				{
					y  = this._getYPosition(val, yPoints);
					y1 = this._getYPosition(nextVal, yPoints);
					
					if(val < yPoints[0].val)
						yk = this._getYPosition(yPoints[0].val, yPoints);
					else
						yk = this._getYPosition(yPoints[yPoints.length - 1].val, yPoints);
					
					x  = xPoints[n].pos; 
					x1 = xPoints[n + 1].pos; 
					
					//находим из двух точек уравнение, из третьей координаты y находим x
					if(nextVal >= yPoints[0].val && nextVal <= yPoints[yPoints.length - 1].val)
					{
						x = (yk * (x - x1) + x1 * y + x1 * y1) / (y - y1);
						y = yk;
					}
					else
					{
						x1 = (yk * (x - x1) + x1 * y + x1 * y1) / (y - y1);
						y1 = yk;
					}
				}
				
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = []
				
				this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
			}
		}
	},
	
	_getYPosition: function(val, yPoints)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - (diffVal / resVal) * resPos;
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					break;
				}
			}
		}
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		var path;
		
		if(val == this.chartProp.series[ser].val.numRef.numCache.pts.length - 1)
			path = this.paths.series[ser][val - 1].ArrPathCommand[1];
		else
			path = this.paths.series[ser][val].ArrPathCommand[0];
			
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_B:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				break;
			}
			case DLBL_POS_L:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case DLBL_POS_R:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case DLBL_POS_T:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_drawLines: function (/*isSkip*/)
    {
		//ширина линии
		var brush;
		var FillUniColor;
		var pen;
		var seria, dataSeries;
		for (var i = 0; i < this.chartProp.series.length; i++) {
			
			//в случае накопительных дигарамм, рисуем в обратном порядке
			if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
				seria = this.chartProp.series[this.chartProp.series.length - 1 - i];
			else
				seria = this.chartProp.series[i];
			
			brush = seria.brush;
			pen = seria.pen;

			dataSeries = seria.val.numRef.numCache.pts;
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				if(seria.val.numRef.numCache.pts[n].pen)
					pen = seria.val.numRef.numCache.pts[n].pen;
				if(seria.val.numRef.numCache.pts[n].brush)
					brush = seria.val.numRef.numCache.pts[n].brush;
				
				this._drawPath(this.paths.series[i][n], brush, pen);
			}
        }
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= (this.chartProp.series.length - i - 1); k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
				{
					if(k <= (this.chartProp.series.length - i - 1))
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val / summVal;
		}
		else
		{
			val = parseFloat(this.chartProp.series[i].val.numRef.numCache.pts[n].val);
		}
		return val;
	},
	
	_calculateLine : function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.lnTo(x1 * pathW, this.chartProp.nullPositionOX / pxToMm * pathH);
		path.lnTo(x * pathW, this.chartProp.nullPositionOX / pxToMm * pathH);
		path.lnTo(x * pathW, y * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		//path.stroke = true;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****HBAR CHART*****
function drawHBarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
	
	this.summBarVal = [];
}

drawHBarChart.prototype =
{
    reCalculate : function(chartProp, cShapeDrawer)
	{
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.summBarVal = [];
		this._recalculateBars();
	},
	
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawBars();
	},
	
	_recalculateBars: function (/*isSkip*/)
    {
        //соответствует подписям оси категорий(OX)
		var xPoints = this.cShapeDrawer.chart.plotArea.valAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cShapeDrawer.chart.plotArea.catAx.yPoints;
		
		var xaxispos      = this.chartProp.xaxispos;
		var heightGraph    = this.chartProp.heightCanvas - this.chartProp.chartGutter._top - this.chartProp.chartGutter._bottom;
		
		//TODO - передавать overlap из меню!
		var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
		var overlap        = this.cShapeDrawer.chart.plotArea.chart.overlap ? this.cShapeDrawer.chart.plotArea.chart.overlap : defaultOverlap;
        var height          = heightGraph / this.chartProp.series[0].val.numRef.numCache.pts.length;
		
		
		var individualBarHeight = height / (this.chartProp.series.length - (this.chartProp.series.length - 1) * (overlap / 100) + this.cShapeDrawer.chart.plotArea.chart.gapWidth / 100);
		var widthOverLap = individualBarHeight * (overlap / 100);
		var hmargin = (this.cShapeDrawer.chart.plotArea.chart.gapWidth / 100 * individualBarHeight) / 2;
		
		var width, startX, startY, diffYVal, val, paths, seriesHeight = [], seria, startXColumnPosition, startYPosition;
		
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i].val.numRef.numCache.pts;
			seriesHeight[i] = [];
			
			for (var j = 0; j < seria.length; j++) {
				
				//стартовая позиция колонки Y(+ высота с учётом поправок на накопительные диаграммы)
				val = parseFloat(seria[j].val);
				startXColumnPosition = this._getStartYColumnPosition(seriesHeight, j, val, xPoints);
				startX = startXColumnPosition.startY / this.chartProp.pxToMM;
				width = startXColumnPosition.width / this.chartProp.pxToMM;

				seriesHeight[i][j] = startXColumnPosition.width;
				
				//стартовая позиция колонки Y
				if(j != 0)
					startYPosition = yPoints[j].pos - (yPoints[j].pos - yPoints[j - 1].pos) / 2;
				else
					startYPosition = this.cShapeDrawer.chart.plotArea.valAx.posY;
				if(i == 0)
					startY = startYPosition * this.chartProp.pxToMM - hmargin - i * (individualBarHeight);
				else
					startY = startYPosition * this.chartProp.pxToMM - hmargin - (i * individualBarHeight - i * widthOverLap);
				
				if(height != 0)
				{
					paths = this._calculateRect(startX, startY / this.chartProp.pxToMM, width, individualBarHeight / this.chartProp.pxToMM);
					
					if(!this.paths.series)
						this.paths.series = [];
					if(!this.paths.series[i])
						this.paths.series[i] = [];
					this.paths.series[i][j] = paths;
				}
			}
        }
    },
	
	_getStartYColumnPosition: function (seriesHeight, j, val, xPoints, summBarVal)
	{
		var startY, diffYVal, width;
		var nullPositionOX = this.chartProp.nullPositionOX/*this.cShapeDrawer.chart.plotArea.catAx.posY * this.chartProp.pxToMM*/;
		if(this.chartProp.subType == "stacked")
		{
			diffYVal = 0;
			for(var k = 0; k < seriesHeight.length; k++)
			{
				if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0)))
					diffYVal += seriesHeight[k][j];
			}
			startY = nullPositionOX + diffYVal;
			width = this._getYPosition(val, xPoints, true) * this.chartProp.pxToMM - nullPositionOX;
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			diffYVal = 0;
			for(var k = 0; k < seriesHeight.length; k++)
			{
				if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0)))
					diffYVal += seriesHeight[k][j];
			}
			
			var tempVal;
			var temp = 0;
			if(!this.summBarVal[j])
			{
				for(var k = 0; k < this.chartProp.series.length; k++)
				{
					tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[j].val);
					if(tempVal)
						temp += Math.abs(tempVal);
				}
				this.summBarVal[j] = temp;
			}
			
			width = this._getYPosition((val / this.summBarVal[j]), xPoints, true) * this.chartProp.pxToMM - nullPositionOX;
			startY = nullPositionOX + diffYVal;
		}
		else
		{
			width = this._getYPosition(val, xPoints, true) * this.chartProp.pxToMM - nullPositionOX;
			startY = nullPositionOX;
		}	
		
		return {startY: startY, width: width};
	},
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - (diffVal / resVal) * resPos;
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					break;
				}
			}
		}
		
		return result;
	},
	
	_drawBars: function ()
    {
		var brush;
		var pen;
		var lineWidth;
		var dataSeries;
		var seria;
		for (var i = 0; i < this.chartProp.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			dataSeries = this.chartProp.series[i].val.numRef.numCache.pts;
			
			for (var j = 0; j < dataSeries.length; j++) {
				if(seria.val.numRef.numCache.pts[j].pen)
					pen = seria.val.numRef.numCache.pts[j].pen;
				if(seria.val.numRef.numCache.pts[j].brush)
					brush = seria.val.numRef.numCache.pts[j].brush;
			
				this._drawPath(this.paths.series[i][j], brush, pen);
			}
		}
    },
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		var path = this.paths.series[ser][val].ArrPathCommand;
			
		var x = path[0].X;
		var y = path[0].Y;
		
		var h = path[0].Y - path[1].Y;
		var w = path[2].X - path[1].X;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX, centerY;
				
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h/2 - height/2;
				break;
			}
			case DLBL_POS_IN_BASE:
			{
				centerX = x;
				centerY = y - h/2 - height/2;
				if( point.val < 0 )
					centerX = x - width;
				break;
			}
			case DLBL_POS_IN_END:
			{
				centerX = x + w - width;
				centerY = y - h/2 - height/2;
				if( point.val < 0 )
					centerX = x + w;
				break;
			}
			case DLBL_POS_OUT_END:
			{
				centerX = x + w;
				centerY = y - h/2 - height/2;
				if( point.val < 0 )
					centerX = x + w - width;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_calculateRect : function(x, y, w, h)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x * pathW, (y - h) * pathH);
		path.lnTo((x + w) * pathW, (y - h) * pathH);
		path.lnTo((x + w) * pathW, y * pathH);
		path.lnTo(x * pathW, y * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****PIE CHART*****
function drawPieChart()
{
	this.tempAngle = null;
	this.paths = {};
}

drawPieChart.prototype =
{
    draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawPie();
	},
	
	reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.tempAngle = null;
		this.paths = {};
		this._reCalculatePie();
	},	
	
	_drawPie: function ()
    {
		var numCache = this.chartProp.series[0].val.numRef.numCache.pts;
		var brush, pen, val;
		var path;
        for (var i = 0,len = numCache.length; i < len; i++) {
			val = this.chartProp.series[0].val.numRef.numCache.pts[i];
			brush = val.brush;
			pen = val.pen;
			path = this.paths.series[i];
            this._drawPath(path, brush, pen);
        }
		
    },
	
	_reCalculatePie: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var numCache = this.chartProp.series[0].val.numRef.numCache.pts;
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		var radius = trueHeight/2;
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		this.tempAngle = Math.PI/2;
		//рисуем против часовой стрелки, поэтому цикл с конца
        for (var i = numCache.length - 1; i >= 0; i--) {
            var angle = Math.abs((parseFloat(numCache[i].val / sumData)) * (Math.PI * 2));
			if(!this.paths.series)
				this.paths.series = [];
            this.paths.series[i] = this._calculateSegment(angle, radius, xCenter, yCenter);
        }
    },
	
	_calculateSegment: function (angle, radius, xCenter, yCenter)
    {
		var startAngle = (this.tempAngle);
		var endAngle   = angle;
		
		if(radius < 0)
			radius = 0;
		var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter);

        this.tempAngle += angle;
		
		return path;
    },
	
	_calculateArc : function(radius, stAng, swAng, xCenter, yCenter)
	{	
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var x0 = xCenter + radius*Math.cos(stAng);
		var y0 = yCenter - radius*Math.sin(stAng);
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);

		path.recalculate(gdLst);
		return path;	
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var pxToMm = this.chartProp.pxToMM;
		var path = this.paths.series[val].ArrPathCommand;
		var centerX = path[0].X;
		var centerY = path[0].Y;
		
		var radius = path[2].hR;
		var stAng = path[2].stAng;
		var swAng = path[2].swAng;
		
		var point = this.chartProp.series[0].val.numRef.numCache.pts[val];
		
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		//TODO высчитать позиции, как в екселе +  ограничения
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
				centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
				break;
			}
			case DLBL_POS_IN_BASE:
			{
				centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
				centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
				/*centerX = centerX + radius * Math.cos(-1 * stAng - swAng / 2) - width / 2;
				centerY = centerY - radius * Math.sin(-1 * stAng - swAng / 2) - height / 2;*/
				break;
			}
			case DLBL_POS_IN_END:
			{
				//centerY = centerY + 27 / pxToMm;
				break;
			}
			case DLBL_POS_OUT_END:
			{
				//centerY = centerY + 27 / pxToMm;
				break;
			}
		}
		if(centerX < 0)
			centerX = 0;
		
		return {x: centerX, y: centerY};
	},
	
	_drawPath : function(path, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
};


//*****Doughnut CHART*****
function drawDoughnutChart()
{
	this.tempAngle = null;
	this.paths = {};
}

drawDoughnutChart.prototype =
{
    draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawPie();
	},
	
	reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.tempAngle = null;
		this.paths = {};
		this._reCalculatePie();
	},	
	
	_drawPie: function ()
    {
		var brush, pen, val;
		var path;
		
        for(var n = 0; n < this.chartProp.series.length; n++) {
			for (var k = 0; k < this.chartProp.series[n].val.numRef.numCache.pts.length; k++) {
				val = this.chartProp.series[0].val.numRef.numCache.pts[k];
				brush = val.brush;
				pen = val.pen;
				path = this.paths.series[n][k];
				this._drawPath(path, brush, pen);
			}
		}
    },
	
	_reCalculatePie: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var sumData;
		var outRadius = trueHeight/2;
		
		//% from out radius  
		var defaultSize = 50;
		var holeSize = this.cShapeDrawer.chart.holeSize ? this.cShapeDrawer.chart.holeSize : defaultSize;
		
		//inner radius
		var radius = outRadius * (holeSize / 100);
		var step = (outRadius - radius) / this.chartProp.series.length;
		
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		for(var n = 0; n < this.chartProp.series.length; n++)
		{
			this.tempAngle = Math.PI/2;
			sumData = this.cChartDrawer._getSumArray(this.chartProp.series[n].val.numRef.numCache.pts, true);
			
			//рисуем против часовой стрелки, поэтому цикл с конца
			for (var k = this.chartProp.series[n].val.numRef.numCache.pts.length - 1; k >= 0; k--) {
				
				var angle = Math.abs((parseFloat(this.chartProp.series[n].val.numRef.numCache.pts[k].val / sumData)) * (Math.PI * 2));
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[n])
					this.paths.series[n] = [];
				this.paths.series[n][k] = this._calculateSegment(angle, radius, xCenter, yCenter, radius + step * (n + 1), radius + step * n);
			}
		}
    },
	
	_calculateSegment: function (angle, radius, xCenter, yCenter, radius1, radius2)
    {
		var startAngle = (this.tempAngle);
		var endAngle   = angle;
		
		if(radius < 0)
			radius = 0;
		var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter, radius1, radius2);

        this.tempAngle += angle;
		
		return path;
    },
	
	_calculateArc : function(radius, stAng, swAng, xCenter, yCenter, radius1, radius2)
	{	
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var x2 = xCenter + radius1*Math.cos(stAng);
		var y2 = yCenter - radius1*Math.sin(stAng);
		
		var x1 = xCenter + radius2*Math.cos(stAng);
		var y1 = yCenter - radius2*Math.sin(stAng);
		
		var x3 = xCenter + radius1*Math.cos(stAng + swAng);
		var y3 = yCenter - radius1*Math.sin(stAng + swAng);
		
		var x4 = xCenter + radius2*Math.cos(stAng + swAng);
		var y4 = yCenter - radius2*Math.sin(stAng + swAng);
		
		path.moveTo(x1  /pxToMm * pathW, y1 / pxToMm * pathH);
		path.lnTo(x2  /pxToMm * pathW, y2 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius1 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(x4 / pxToMm * pathW, y4 / pxToMm * pathH);
		path.arcTo(radius2 / pxToMm * pathW, radius2 / pxToMm * pathH,  -1 * stAng*cToDeg - swAng*cToDeg, swAng*cToDeg);
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		
		path.recalculate(gdLst);
		return path;	
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var pxToMm = this.chartProp.pxToMM;
		var path = this.paths.series[ser][val].ArrPathCommand;
		var x1 = path[0].X;
		var y1 = path[0].Y;
		
		var x2 = path[1].X;
		var y2 = path[1].Y;
		
		var radius1 = path[2].hR;
		var stAng = path[2].stAng;
		var swAng = path[2].swAng;
		
		var radius2 = path[4].hR;
		var xCenter = path[5].X;
		var yCenter = path[5].Y;
		
		
		var newRadius = radius2 + (radius1 - radius2) / 2;
		var centerX = xCenter + newRadius * Math.cos(-1 * stAng - swAng / 2); 
		var centerY = yCenter - newRadius * Math.sin(-1 * stAng - swAng / 2); 
		
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_CTR:
			{
				centerX = centerX  - width / 2;
				centerY = centerY - height / 2;
				break;
			}
			case DLBL_POS_IN_BASE:
			{
				centerX = centerX  - width / 2;
				centerY = centerY - height / 2;
				break;
			}
		}
		if(centerX < 0)
			centerX = 0;
		if(centerY < 0)
			centerY = 0;
		
		return {x: centerX, y: centerY};
	},
	
	_drawPath : function(path, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
};


//*****Scatter CHART*****
function drawScatterChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
}

drawScatterChart.prototype =
{
    reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.paths = {};
		
		this._recalculateScatter();
	},
	
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		
		this._drawScatter();
	},
	
	_recalculateScatter: function ()
    {
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cShapeDrawer.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cShapeDrawer.chart.plotArea.valAx.yPoints;
		
		var trueHeight = this.chartProp.trueHeight;
		var trueWidth  = this.chartProp.trueWidth;
		
		var minOy = this.chartProp.ymin;
		var maxOy = this.chartProp.ymax;
		var maxOx = this.chartProp.xScale[this.chartProp.xScale.length - 1];
		var minOx = this.chartProp.xScale[0];
		
		var digHeightOy = Math.abs(maxOy - minOy);
		var digHeightOx = Math.abs(maxOx - minOx);

		var koffX = trueWidth/digHeightOx;
		var koffY = trueHeight/digHeightOy;	
		
		var seria, yVal, xVal, points, x, x1, y, y1;
		for(var i = 0; i < this.chartProp.series.length; i++)
		{
			seria = this.chartProp.series[i];
			points = [];
			for(var n = 0; n < seria.yVal.numRef.numCache.pts.length; n++)
			{
				yVal = parseFloat(seria.yVal.numRef.numCache.pts[n].val);
				if(seria.xVal && seria.xVal.numRef.numCache.pts[n] && seria.xVal.numRef.numCache.pts[n].val)
				{
					if(!isNaN(parseFloat(seria.xVal.numRef.numCache.pts[n].val)))
						xVal = parseFloat(seria.xVal.numRef.numCache.pts[n].val);
					else
						xVal = n + 1;
				}
				else
					xVal = n + 1;
				
				points[n] = {x: xVal, y: yVal}
			}
			
			for(var k = 0; k < points.length; k++)
			{
				
				if(k == points.length - 1)
				{
					y = this._getYPosition(points[k].y, yPoints);
					x = this._getYPosition(points[k].x, xPoints, true);
				}
				else
				{
					y  = this._getYPosition(points[k].y, yPoints);
					y1 = this._getYPosition(points[k + 1].y, yPoints);
					
					x  = this._getYPosition(points[k].x, xPoints, true);
					x1 = this._getYPosition(points[k + 1].x, xPoints, true);
					
					if(!this.paths.series)
						this.paths.series = [];
					if(!this.paths.series[i])
						this.paths.series[i] = [];
						
					this.paths.series[i][k] = this._calculateLine(x, y, x1, y1);
				}
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];
				
				this.paths.points[i][k] = this._calculatePoint(x, y, seria.yVal.numRef.numCache.pts[k].compiledMarker.size, seria.yVal.numRef.numCache.pts[k].compiledMarker.symbol);
			}
		}
    },
	
	_drawScatter: function ()
    {
		var seria, brush, pen, markerBrush, markerPen;
		for(var i = 0; i < this.paths.series.length; i++)
		{
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			//draw line
			for(var k = 0; k < this.paths.series[i].length; k++)
			{
				brush = this.chartProp.series[i].brush;
				pen = this.chartProp.series[i].pen;
				
				if(this.chartProp.series[i].yVal.numRef.numCache.pts[k].pen)
					pen = this.chartProp.series[i].yVal.numRef.numCache.pts[k].pen;
				if(this.chartProp.series[i].yVal.numRef.numCache.pts[k].brush)
					brush = this.chartProp.series[i].yVal.numRef.numCache.pts[k].brush;
					
				//draw line
				this._drawPath(this.paths.series[i][k], brush, pen, true);
			}
			
			//draw point
			for(var k = 0; k < this.paths.points[i].length; k++)
			{	
				markerBrush = this.chartProp.series[i].yVal.numRef.numCache.pts[k].compiledMarker.brush;
				markerPen = this.chartProp.series[i].yVal.numRef.numCache.pts[k].compiledMarker.pen;
				
				//frame of point
				if(this.paths.points[i][0].framePaths)
					this._drawPath(this.paths.points[i][k].framePaths, markerBrush, markerPen, false);
				//point		
				this._drawPath(this.paths.points[i][k].path, markerBrush, markerPen, true);
			}
		}
    },
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - (diffVal / resVal) * resPos;
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
						
					break;
				}
			}
		}
		
		return result;
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(x * pathH, y * pathW);
		path.lnTo(x1 * pathH, y1 * pathW);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculatePoint: function(x, y, size, symbol)
	{
		size = size / 2.69;
		var halfSize = size / 2;
		var path  = new Path();
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];

		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var framePaths = null;
		
		var result;

		/*
		var SYMBOL_PICTURE = 5;*/

		switch ( symbol )
		{
			case SYMBOL_DASH:
			{
				path.moveTo((x - halfSize) * pathW, y * pathW);
				path.lnTo((x + halfSize) * pathW, y * pathW);
				break;
			}
			case SYMBOL_DOT:
			{
				path.moveTo((x - halfSize / 2) * pathW, y * pathW);
				path.lnTo((x + halfSize / 2) * pathW, y * pathW);
				break;
			}
			
			case SYMBOL_PLUS:
			{
				path.moveTo(x * pathW, (y  + halfSize) * pathW);
				path.lnTo(x * pathW, (y  - halfSize) * pathW);
				path.moveTo((x - halfSize) * pathW, y * pathW);
				path.lnTo((x  + halfSize) * pathW, y * pathW);
				break;
			}
			
			case SYMBOL_CIRCLE:
			{
				path.moveTo((x + halfSize) * pathW, y * pathW);
				path.arcTo(halfSize * pathW, halfSize * pathW, 0, Math.PI * 2 * cToDeg);
				break;
			}
			
			case SYMBOL_STAR:
			{
				path.moveTo((x - halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y  - halfSize) * pathW);
				path.moveTo((x + halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x  - halfSize) * pathW, (y  - halfSize) * pathW);
				path.moveTo(x * pathW, (y  + halfSize) * pathW);
				path.lnTo(x * pathW, (y  - halfSize) * pathW);
				break;
			}
			
			case SYMBOL_X:
			{
				path.moveTo((x - halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y  - halfSize) * pathW);
				path.moveTo((x + halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x  - halfSize) * pathW, (y  - halfSize) * pathW);
				break;
			}
			
			case SYMBOL_TRIANGLE:
			{
				path.moveTo((x - size/Math.sqrt(3)) * pathW, (y  + size/3) * pathW);
				path.lnTo(x * pathW, (y  - (2/3)*size) * pathW);
				path.lnTo((x + size/Math.sqrt(3)) * pathW, (y  + size/3) * pathW)
				path.lnTo((x - size/Math.sqrt(3)) * pathW, (y  + size/3) * pathW);
				break;
			}
			
			case SYMBOL_SQUARE:
			{
				path.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
				path.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
				path.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
			}
			
			case SYMBOL_DIAMOND:
			{
				path.moveTo((x - halfSize) * pathW, y * pathW);
				path.lnTo(x * pathW, (y  - halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, y * pathW);
				path.lnTo(x * pathW, (y  + halfSize) * pathW);
				path.lnTo((x - halfSize) * pathW, y  * pathW);
				break;
			}
		}
		
		if(symbol == "Plus" || symbol == "Star" || symbol == "X")
		{
			framePaths = new Path();
			framePaths.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
			framePaths.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
			framePaths.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
			framePaths.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
			framePaths.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
		}
		
		path.recalculate(gdLst);
		if(framePaths)
			framePaths.recalculate(gdLst);
		result = {framePaths: framePaths, path: path};
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.chartProp.series[ser - 1].yVal.numRef.numCache.pts[val];
		var path;
		
		if(val == this.chartProp.series[ser - 1].yVal.numRef.numCache.pts.length - 1)
			path = this.paths.series[ser - 1][val - 1].ArrPathCommand[1];
		else
			path = this.paths.series[ser - 1][val].ArrPathCommand[0];
			
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_B:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				break;
			}
			case DLBL_POS_L:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case DLBL_POS_R:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case DLBL_POS_T:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
		
		return {x: centerX, y: centerY};
	},
	
	_drawPath: function(path, brush, pen, stroke)
	{
		path.stroke = stroke;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
};


//*****Stock CHART*****
function drawStockChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawStockChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.cChartSpace = chartSpace;
		this._drawLines();
	},
	
	reCalculate : function(chartProp, cChartSpace)
    {
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cChartSpace = cChartSpace;
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{	
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var trueWidth = this.chartProp.trueWidth;

		var koffX = trueWidth / this.chartProp.series[0].val.numRef.numCache.pts.length;
		var widthBar = koffX / (1 + this.cChartSpace.chart.plotArea.chart.upDownBars.gapWidth / 100);
		
		var val1, val2, val3, val4, xVal, yVal1, yVal2, yVal3, yVal4;
		for (var i = 0; i < this.chartProp.series[0].val.numRef.numCache.pts.length; i++) {
			
			val1 = this.chartProp.series[0].val.numRef.numCache.pts[i].val;
			val4 = this.chartProp.series[this.chartProp.series.length - 1].val.numRef.numCache.pts[i].val;
			
			for(var k = 1; k < this.chartProp.series.length - 1; k++)
			{
				if(k == 1)
				{
					val2 = this.chartProp.series[k].val.numRef.numCache.pts[i].val;
					val3 = this.chartProp.series[k].val.numRef.numCache.pts[i].val;
				}
				else
				{
					if(parseFloat(val2) > parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[i].val))	
						val2 = this.chartProp.series[k].val.numRef.numCache.pts[i].val;
					if(parseFloat(val3) < parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[i].val))	
						val3 = this.chartProp.series[k].val.numRef.numCache.pts[i].val;
				}
			}
			
			if(!this.paths.values)
					this.paths.values = [];
			if(!this.paths.values[i])
				this.paths.values[i] = {};
			
			xVal = this._getYPosition(i, xPoints, true);
			yVal1 = this._getYPosition(val1, yPoints);
			yVal2 = this._getYPosition(val2, yPoints);
			yVal3 = this._getYPosition(val3, yPoints);
			yVal4 = this._getYPosition(val4, yPoints);
			
			this.paths.values[i].lowLines = this._calculateLine(xVal, yVal2, xVal, yVal1);
			this.paths.values[i].highLines = this._calculateLine(xVal, yVal4, xVal, yVal3);
			
			if(parseFloat(val1) > parseFloat(val4))
				this.paths.values[i].downBars = this._calculateUpDownBars(xVal, yVal1, xVal, yVal4, widthBar / this.chartProp.pxToMM);
			else
				this.paths.values[i].upBars = this._calculateUpDownBars(xVal, yVal1, xVal, yVal4, widthBar / this.chartProp.pxToMM);
		}
	},
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - (diffVal / resVal) * resPos;
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
						
					break;
				}
			}
		}
		
		return result;
	},

	
	_drawLines: function (isRedraw/*isSkip*/)
    {
		var brush;
		var pen;
		var dataSeries;
		var seria;
		for (var i = 0; i < this.chartProp.series[0].val.numRef.numCache.pts.length; i++) {

			pen = this.cChartSpace.chart.plotArea.chart.calculatedHiLowLines;
				
			this._drawPath(this.paths.values[i].lowLines, brush, pen);
			
			this._drawPath(this.paths.values[i].highLines, brush, pen);
			
			if(this.paths.values[i].downBars)
			{
				brush = this.cChartSpace.chart.plotArea.chart.upDownBars.downBarsBrush;
				pen = this.cChartSpace.chart.plotArea.chart.upDownBars.downBarsPen;
				this._drawPath(this.paths.values[i].downBars, brush, pen);
			}
			else
			{
				brush = this.cChartSpace.chart.plotArea.chart.upDownBars.upBarsBrush;
				pen = this.cChartSpace.chart.plotArea.chart.upDownBars.upBarsPen;
				this._drawPath(this.paths.values[i].upBars, brush, pen);
			}
        }
    },
	
	_calculateLine : function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var pxToMm = this.chartProp.pxToMM;
		var min = this.chartProp.scale[0];
		var max = this.chartProp.scale[this.chartProp.scale.length - 1];

		
		var digHeight = Math.abs(max - min);
		
		if(this.chartProp.min < 0 && this.chartProp.max <= 0)
			min = -1*max;

		var koffX = this.chartProp.trueWidth / this.chartProp.series[0].val.numRef.numCache.pts.length;
		var koffY = this.chartProp.trueHeight / digHeight;
		
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		
		var x = this.chartProp.chartGutter._left + (val)*koffX + koffX/2;
		var y = this.chartProp.trueHeight - (point.val - min)*koffY + this.chartProp.chartGutter._top;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x / pxToMm - width/2;
		var centerY = y / pxToMm - height/2;
		var constMargin = 5 / pxToMm;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_B:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case DLBL_POS_BEST_FIT:
			{
				break;
			}
			case DLBL_POS_CTR:
			{
				break;
			}
			case DLBL_POS_L:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case DLBL_POS_R:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case DLBL_POS_T:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_calculateUpDownBars: function(x, y, x1, y1, width)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo((x - width/2) * pathW, y * pathH);
		path.lnTo((x - width/2) * pathW, y1 * pathH);
		path.lnTo((x + width/2) * pathW, y1 * pathH);
		path.lnTo((x + width/2) * pathW, y * pathH);
		path.lnTo((x - width/2) * pathW, y * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		path.stroke = true;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
};

//*****GRID*****
function gridChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.chartSpace = null;
	this.paths = {};
}

gridChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this._drawHorisontalLines();
		this._drawVerticalLines();
	},
	
	reCalculate : function(chartProp, cShapeDrawer, chartSpace)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this.paths = {};
		this._calculateHorisontalLines();
		this._calculateVerticalLines();
	},
	
	_calculateHorisontalLines : function()
	{
		var stepY = (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - this.chartProp.chartGutter._top)/(this.chartProp.numhlines);
		var minorStep = stepY/this.chartProp.numhMinorlines;
		var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
		var posX = this.chartProp.chartGutter._left;
		var posY;
		var posMinorY;
		for(var i = 0; i <= this.chartProp.numhlines; i++)
		{
			posY = i*stepY + this.chartProp.chartGutter._top;
			if(!this.paths.horisontalLines)
				this.paths.horisontalLines = [];
			this.paths.horisontalLines[i] = this._calculateLine(posX, posY, posX + widthLine, posY);
			
			//промежуточные линии
			for(var n = 0; n < this.chartProp.numhMinorlines; n++)
			{
				posMinorY = posY + n*minorStep;
				if(!this.paths.horisontalMinorLines)
					this.paths.horisontalMinorLines = [];
				if(!this.paths.horisontalMinorLines[i])
					this.paths.horisontalMinorLines[i] = [];
				
				this.paths.horisontalMinorLines[i][n] = this._calculateLine(posX, posMinorY, posX + widthLine, posMinorY);
			}
		}
	},
	
	_calculateVerticalLines: function()
	{
		var stepX = (this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right)/(this.chartProp.numvlines);
		var minorStep = stepX/this.chartProp.numvMinorlines;
		var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._bottom +this.chartProp.chartGutter._top);
		var posY = this.chartProp.chartGutter._top;
		var posX;
		var posMinorX;
		for(var i = 0; i <= this.chartProp.numvlines; i++)
		{
			posX = i*stepX + this.chartProp.chartGutter._left;
			if(!this.paths.verticalLines)
				this.paths.verticalLines = [];
			this.paths.verticalLines[i] = this._calculateLine(posX, posY, posX, posY + heightLine);
			
			//промежуточные линии
			for(var n = 0; n < this.chartProp.numvMinorlines; n++)
			{
				posMinorX = posX + n*minorStep;
				if(!this.paths.verticalMinorLines)
					this.paths.verticalMinorLines = [];
				if(!this.paths.verticalMinorLines[i])
					this.paths.verticalMinorLines[i] = [];
				
				this.paths.verticalMinorLines[i][n] = this._calculateLine(posMinorX, posY, posMinorX, posY + heightLine);
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.stroke = true;
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawHorisontalLines: function()
	{
		var pen;
		var path;
		for(var i = 0; i <= this.chartProp.numhlines; i++)
		{
			if(this.chartProp.type == "HBar")
				pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
			else
				pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
				
			path = this.paths.horisontalLines[i];
			this._drawPath(path, pen);
			
			//промежуточные линии
			if(i != this.chartProp.numhlines && this.paths.horisontalMinorLines)
			{
				for(var n = 0; n < this.paths.horisontalMinorLines[i].length ; n++)
				{
					path = this.paths.horisontalMinorLines[i][n];
					if(this.chartProp.type == "HBar")
						pen = this.chartSpace.chart.plotArea.catAx.compiledMinorGridLines;
					else
						pen = this.chartSpace.chart.plotArea.valAx.compiledMinorGridLines;
					this._drawPath(path, pen);
				}
			}
		}
	},
	
	_drawVerticalLines: function()
	{
		var pen, path;
		for(var i = 0; i <= this.chartProp.numvlines; i++)
		{
			if(this.chartProp.type == "HBar")
				pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
			else
				pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
				
			path = this.paths.verticalLines[i];
			this._drawPath(path, pen);
			
			//промежуточные линии
			if(i != this.chartProp.numvlines)
			{
				for(var n = 0; n < this.paths.verticalMinorLines[i].length ; n++)
				{
					path = this.paths.verticalMinorLines[i][n];
					if(this.chartProp.type == "HBar")
						pen = this.chartSpace.chart.plotArea.valAx.compiledMinorGridLines;
					else
						pen = this.chartSpace.chart.plotArea.catAx.compiledMinorGridLines;
					this._drawPath(path, pen);
				}
			}
		}	
	},
	
	_drawPath: function(path, pen)
	{	
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}	
	

//*****Category axis*****
function catAxisChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.chartSpace = null;
	this.paths = {};
}

catAxisChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this._drawAxis();
		this._drawTickMark();
	},
	
	reCalculate : function(chartProp, cShapeDrawer, chartSpace)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this.paths = {};
		this._calculateAxis();
		this._calculateTickMark();
	},
	
	_calculateAxis : function()
	{
		var nullPoisition = this.chartProp.nullPositionOX;
		if(this.chartProp.type == "HBar")
		{	
			this.paths.axisLine = this._calculateLine( nullPoisition / this.chartProp.pxToMM, this.chartProp.chartGutter._top / this.chartProp.pxToMM, nullPoisition / this.chartProp.pxToMM, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM);
		}
		else
		{
			this.paths.axisLine = this._calculateLine( this.chartProp.chartGutter._left / this.chartProp.pxToMM, nullPoisition / this.chartProp.pxToMM, (this.chartProp.widthCanvas - this.chartProp.chartGutter._right) / this.chartProp.pxToMM, nullPoisition / this.chartProp.pxToMM );
		}
	},
	
	_calculateTickMark : function()
	{
		var widthLine, widthMinorLine;
		switch ( this.chartSpace.chart.plotArea.catAx.majorTickMark )
		{
			case TICK_MARK_CROSS:
			{
				break;
			}
			case TICK_MARK_IN:
			{
				widthLine = -3;
				break;
			}
			case TICK_MARK_NONE:
			{
				widthLine = 0;
				break;
			}
			case TICK_MARK_OUT:
			{
				widthLine = 3;
				break;
			}
		};
		
		switch ( this.chartSpace.chart.plotArea.catAx.minorTickMark )
		{
			case TICK_MARK_CROSS:
			{
				break;
			}
			case TICK_MARK_IN:
			{
				widthMinorLine = -3;
				break;
			}
			case TICK_MARK_NONE:
			{
				widthMinorLine = 0;
				break;
			}
			case TICK_MARK_OUT:
			{
				widthMinorLine = 3;
				break;
			}
		};
		
		if(this.chartProp.type == "HBar")
		{
			widthMinorLine = - widthMinorLine;
			widthLine = - widthLine;
		}
		
		if(!(widthLine === 0 && widthMinorLine === 0))
		{
			if(this.chartProp.type == "HBar")
			{
				var yPoints = this.chartSpace.chart.plotArea.catAx.yPoints;

				var stepY = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[1].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
				var minorStep = stepY / this.chartProp.numhMinorlines;
				
				var posX = this.chartSpace.chart.plotArea.catAx.posX;

				var posY;
				var posMinorY;
				for(var i = 0; i < yPoints.length; i++)
				{
					//основные линии
					posY = yPoints[i].pos;
					
					if(!this.paths.tickMarks)
						this.paths.tickMarks = [];
					this.paths.tickMarks[i] = this._calculateLine(posX, posY, posX + widthLine / this.chartProp.pxToMM, posY);
					
					//промежуточные линии
					if(widthMinorLine !== 0)
					{
						for(var n = 0; n < this.chartProp.numhMinorlines; n++)
						{
							posMinorY = posY + n * minorStep;
							if(!this.paths.minorTickMarks)
								this.paths.minorTickMarks = [];
							if(!this.paths.minorTickMarks[i])
								this.paths.minorTickMarks[i] = [];
							
							this.paths.minorTickMarks[i][n] = this._calculateLine(posX, posMinorY, posX + widthMinorLine / this.chartProp.pxToMM, posMinorY);
						}
					}
				}
			}
			else
			{
				var xPoints = this.chartSpace.chart.plotArea.catAx.xPoints;
				
				var stepX = xPoints[1] ? Math.abs(xPoints[1].pos - xPoints[0].pos) : Math.abs(xPoints[1].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
				var minorStep = stepX / this.chartProp.numvMinorlines;
				
				var posY = this.chartSpace.chart.plotArea.catAx.posY;
				var posX;
				var posMinorX;
				for(var i = 0; i < xPoints.length; i++)
				{
					posX = xPoints[i].pos;
					if(!this.paths.tickMarks)
						this.paths.tickMarks = [];
					this.paths.tickMarks[i] = this._calculateLine(posX, posY, posX, posY + widthLine / this.chartProp.pxToMM);
					
					//промежуточные линии
					if(widthMinorLine !== 0)
					{
						for(var n = 0; n < this.chartProp.numvMinorlines; n++)
						{
							posMinorX = posX + n * minorStep;
							if(!this.paths.minorTickMarks)
								this.paths.minorTickMarks = [];
							if(!this.paths.minorTickMarks[i])
								this.paths.minorTickMarks[i] = [];
							
							this.paths.minorTickMarks[i][n] = this._calculateLine(posMinorX, posY, posMinorX, posY + widthMinorLine / this.chartProp.pxToMM);
						}
					}
				}
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawAxis: function()
	{
		var pen;
		var path;
	
		pen = this.chartSpace.chart.plotArea.catAx.compiledLn;	
		path = this.paths.axisLine;
		this._drawPath(path, pen);
	},
	
	_drawTickMark: function()
	{
		var pen, path;
		if(this.paths.tickMarks)
		{
			for(var i = 0; i < this.paths.tickMarks.length; i++)
			{
				pen = this.chartSpace.chart.plotArea.catAx.compiledTickMarkLn;
					
				path = this.paths.tickMarks[i];
				this._drawPath(path, pen);
				
				//промежуточные линии
				if(i != this.chartProp.numvlines && this.paths.minorTickMarks)
				{
					for(var n = 0; n < this.paths.minorTickMarks[i].length ; n++)
					{
						path = this.paths.minorTickMarks[i][n];
						this._drawPath(path, pen);
					}
				}
			}	
		}
	},
	
	_drawPath: function(path, pen)
	{	
		path.stroke = true;
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}	


//*****value axis*****
function valAxisChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.chartSpace = null;
	this.paths = {};
}

valAxisChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this._drawAxis();
		this._drawTickMark();
	},
	
	reCalculate : function(chartProp, cShapeDrawer, chartSpace)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this.paths = {};
		this._calculateAxis();
		this._calculateTickMark();
	},
	
	_calculateAxis : function()
	{
		var nullPoisition = this.chartSpace.chart.plotArea.valAx.posX;
		if(this.chartProp.type == "HBar")
		{	
			nullPoisition = this.chartSpace.chart.plotArea.valAx.posY;
			this.paths.axisLine = this._calculateLine( this.chartProp.chartGutter._left / this.chartProp.pxToMM, nullPoisition, (this.chartProp.widthCanvas - this.chartProp.chartGutter._right) / this.chartProp.pxToMM, nullPoisition );
		}
		else
		{
			this.paths.axisLine = this._calculateLine( nullPoisition, this.chartProp.chartGutter._top / this.chartProp.pxToMM, nullPoisition, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM );
		}
	},
	
	_calculateTickMark : function()
	{
		var widthLine, widthMinorLine;
		switch ( this.chartSpace.chart.plotArea.valAx.majorTickMark )
		{
			case TICK_MARK_CROSS:
			{
				break;
			}
			case TICK_MARK_IN:
			{
				widthLine = 3;
				break;
			}
			case TICK_MARK_NONE:
			{
				widthLine = 0;
				break;
			}
			case TICK_MARK_OUT:
			{
				widthLine = -3;
				break;
			}
		};
		
		switch ( this.chartSpace.chart.plotArea.valAx.minorTickMark )
		{
			case TICK_MARK_CROSS:
			{
				break;
			}
			case TICK_MARK_IN:
			{
				widthMinorLine = 3;
				break;
			}
			case TICK_MARK_NONE:
			{
				widthMinorLine = 0;
				break;
			}
			case TICK_MARK_OUT:
			{
				widthMinorLine = -3;
				break;
			}
		};
		
		if(this.chartProp.type == "HBar")
		{
			widthMinorLine = - widthMinorLine;
			widthLine = - widthLine;
		}
		
		if(!(widthLine === 0 && widthMinorLine === 0))
		{
			if(this.chartProp.type == "HBar")
			{
				var yPoints = this.chartSpace.chart.plotArea.valAx.xPoints;
				
				var stepX = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[1].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
				var minorStep = stepX / this.chartProp.numvMinorlines;
				
				var posY = this.chartSpace.chart.plotArea.valAx.posY;
				var posX;
				var posMinorX;
				for(var i = 0; i < yPoints.length; i++)
				{
					posX = yPoints[i].pos;
					if(!this.paths.tickMarks)
						this.paths.tickMarks = [];
					this.paths.tickMarks[i] = this._calculateLine(posX, posY, posX, posY + widthLine / this.chartProp.pxToMM);
					
					//промежуточные линии
					if(widthMinorLine !== 0)
					{
						for(var n = 0; n < this.chartProp.numvMinorlines; n++)
						{
							posMinorX = posX + n * minorStep;
							if(!this.paths.minorTickMarks)
								this.paths.minorTickMarks = [];
							if(!this.paths.minorTickMarks[i])
								this.paths.minorTickMarks[i] = [];
							
							this.paths.minorTickMarks[i][n] = this._calculateLine(posMinorX, posY, posMinorX, posY + widthMinorLine / this.chartProp.pxToMM);
						}
					}
				}
			}
			else
			{
				var yPoints = this.chartSpace.chart.plotArea.valAx.yPoints;

				var stepY = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[1].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
				var minorStep = stepY / this.chartProp.numhMinorlines;
				
				var posX = this.chartSpace.chart.plotArea.valAx.posX;

				var posY;
				var posMinorY;
				for(var i = 0; i < yPoints.length; i++)
				{
					//основные линии
					posY = yPoints[i].pos;
					
					if(!this.paths.tickMarks)
						this.paths.tickMarks = [];
					this.paths.tickMarks[i] = this._calculateLine(posX, posY, posX + widthLine / this.chartProp.pxToMM, posY);
					
					//промежуточные линии
					if(widthMinorLine !== 0)
					{
						for(var n = 0; n < this.chartProp.numhMinorlines; n++)
						{
							posMinorY = posY + n * minorStep;
							if(!this.paths.minorTickMarks)
								this.paths.minorTickMarks = [];
							if(!this.paths.minorTickMarks[i])
								this.paths.minorTickMarks[i] = [];
							
							this.paths.minorTickMarks[i][n] = this._calculateLine(posX, posMinorY, posX + widthMinorLine / this.chartProp.pxToMM, posMinorY);
						}
					}
				}
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawAxis: function()
	{
		var pen;
		var path;
	
		pen = this.chartSpace.chart.plotArea.catAx.compiledLn;	
		path = this.paths.axisLine;
		this._drawPath(path, pen);
	},
	
	_drawTickMark: function()
	{
		var pen, path;
		for(var i = 0; i < this.paths.tickMarks.length; i++)
		{
			pen = this.chartSpace.chart.plotArea.valAx.compiledTickMarkLn;
				
			path = this.paths.tickMarks[i];
			this._drawPath(path, pen);
			
			//промежуточные линии
			if(i != this.chartProp.numvlines && this.paths.minorTickMarks)
			{
				for(var n = 0; n < this.paths.minorTickMarks[i].length ; n++)
				{
					path = this.paths.minorTickMarks[i][n];
					this._drawPath(path, pen);
				}
			}
		}	
	},
	
	_drawPath: function(path, pen)
	{	
		path.stroke = true;
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}	

	
//*****all area of chart*****
function allAreaChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.chartSpace = null;
	
	this.paths = null;
}

allAreaChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this._drawArea();
	},
	
	reCalculate: function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		
		this.paths = null;
		this._calculateArea();
	},
	
	_calculateArea: function()
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(0, 0);
		path.lnTo(0 / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
		path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
		path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, 0 / pxToMm * pathH);
		path.lnTo(0, 0);
		
		path.recalculate(gdLst);
		this.paths = path;
	},
	
	_drawArea: function()
	{
		var pen = this.chartSpace.pen;
		var brush = this.chartSpace.brush;
		this._drawPaths(this.paths, brush, pen);
	},
	
	_drawPaths: function(paths, brush, pen)
	{
		paths.stroke = true;
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		cGeometry.AddPath(paths);
		this.cShapeDrawer.draw(cGeometry);
	}
}	
	
//*****Area of chart*****
function areaChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.chartSpace = null;
	
	this.paths = null;
}

areaChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this._drawArea();
	},
	
	reCalculate: function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		
		this.paths = null;
		this._calculateArea();
	},
	
	_calculateArea: function()
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var widthGraph = this.chartProp.widthCanvas;
		var heightGraph = this.chartProp.heightCanvas;
		var leftMargin = this.chartProp.chartGutter._left;
		var rightMargin = this.chartProp.chartGutter._right;
		var topMargin = this.chartProp.chartGutter._top;
		var bottomMargin = this.chartProp.chartGutter._bottom;
		
		
		path.moveTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		path.lnTo((widthGraph - rightMargin)  / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		path.lnTo((widthGraph - rightMargin) / pxToMm * pathW, topMargin / pxToMm * pathH);
		path.lnTo(leftMargin / pxToMm * pathW, topMargin / pxToMm * pathH);
		path.moveTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		
		path.recalculate(gdLst);
		this.paths = path;
	},
	
	_drawArea: function()
	{
		var pen = this.chartSpace.chart.plotArea.pen;
		var brush = this.chartSpace.chart.plotArea.brush;
		this._drawPaths(this.paths, brush, pen);
	},
	
	_drawPaths: function(paths, brush, pen)
	{
		paths.stroke = true;
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		cGeometry.AddPath(paths);
		this.cShapeDrawer.draw(cGeometry);
	}
}	
	
//****another functions and classes***
function CGeometry2()
{
    this.pathLst = [];
	this.isLine = false;
	this.gdLst = [];
}

CGeometry2.prototype =
{
    canFill: function()
    {
        if(this.preset === "line")
            return false;
        for(var i = 0; i < this.pathLst.length; ++i)
        {
            if(this.pathLst[i].fill !== "none")
                return true;
        }
        return  false;
    },

    getObjectType: function()
    {
        return CLASS_TYPE_GEOMETRY;
    },

    AddPath: function(path)
    {
        this.pathLst.push(path);
    },
	
    AddRect: function(l, t, r, b)
    {
        this.rectS = {};
        this.rectS.l = l;
        this.rectS.t = t;
        this.rectS.r = r;
        this.rectS.b = b;
    },

    draw: function(shape_drawer)
    {
        for (var i=0, n=this.pathLst.length; i<n;++i)
            this.pathLst[i].draw(shape_drawer);
    }
};
