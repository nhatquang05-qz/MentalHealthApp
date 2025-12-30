import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

const chartSpacing = (screenWidth - 70) / 6;

interface MoodChartProps {
  data: any[];
  colors: any;
}

const MoodChart: React.FC<MoodChartProps> = ({ data, colors }) => {
  return (
    <View style={{ paddingLeft: 0, paddingTop: 10, marginLeft: -10 }}>
      <LineChart
        data={data}
        height={220}
        width={screenWidth - 80}
        spacing={chartSpacing}
        initialSpacing={20}
        isAnimated
        curved
        thickness={3}
        color1={colors.primary}
        hideDataPoints={false}
        dataPointsColor1="transparent"
        dataPointsRadius={0}
        startFillColor1={colors.primary}
        endFillColor1={colors.card}
        startOpacity={0.9}
        endOpacity={0.1}
        maxValue={16}
        noOfSections={4}
        yAxisLabelContainerStyle={{ width: 30 }}
        yAxisLabelSuffix=""
        yAxisTextStyle={{ color: colors.subText, fontSize: 12 }}
        xAxisLabelTextStyle={{ color: colors.subText, fontSize: 10 }}
        rulesType="solid"
        rulesColor={colors.border}
        xAxisColor={colors.border}
        yAxisColor={colors.border}
        hideYAxisText={false}
      />
    </View>
  );
};

export default MoodChart;
