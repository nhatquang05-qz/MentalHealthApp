import React, { useMemo } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

interface MoodChartProps {
  data: any[];
  colors: any;
}

const MoodChart: React.FC<MoodChartProps> = ({ data, colors }) => {
  const chartWidth = screenWidth - 90;

  const initialSpacing = 10;
  const endSpacing = 30;

  const spacing =
    data && data.length > 1
      ? (chartWidth - initialSpacing - endSpacing) / (data.length - 1)
      : chartWidth;

  const processedData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      customDataPoint: () => {
        const OriginalComponent = item.customDataPoint ? item.customDataPoint : null;
        if (!OriginalComponent) return null;

        return (
          <View
            style={{
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <OriginalComponent />
          </View>
        );
      },
    }));
  }, [data]);

  const chartKey = useMemo(() => {
    return `chart-${data.length}-${JSON.stringify(data.map((d) => d.value))}`;
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <View
        style={{
          height: 220,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: colors.border,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 12,
        }}
      >
        <Text style={{ color: colors.subText }}>Chưa có dữ liệu biểu đồ</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 10, alignItems: 'center' }}>
      <LineChart
        key={chartKey}
        data={processedData}
        height={220}
        width={chartWidth}
        spacing={spacing}
        initialSpacing={initialSpacing}
        endSpacing={endSpacing}
        disableScroll={false}
        isAnimated
        animationDuration={1000}
        curved
        thickness={3}
        color1={colors.primary}
        hideDataPoints={false}
        dataPointsColor1="transparent"
        dataPointsRadius={0}
        startFillColor1={colors.primary}
        endFillColor1={colors.card}
        startOpacity={0.8}
        endOpacity={0.1}
        areaChart
        maxValue={16}
        noOfSections={4}
        stepValue={4}
        yAxisLabelContainerStyle={{ width: 30 }}
        yAxisTextStyle={{ color: colors.subText, fontSize: 10 }}
        yAxisColor="transparent"
        xAxisLabelTextStyle={{ color: colors.subText, fontSize: 10, width: 40 }}
        xAxisColor={colors.border}
        rulesType="solid"
        rulesColor={colors.border + '40'}
        hideRules={false}
        overflowTop={40}
        pointerConfig={{
          pointerStripWidth: 0,
          pointerStripColor: 'transparent',

          pointerColor: 'transparent',
          radius: 10,

          pointerLabelWidth: 40,
          pointerLabelHeight: 30,

          shiftPointerLabelY: 0,
          shiftPointerLabelX: 0,

          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: false,

          pointerLabelComponent: (items: any) => {
            const val = items[0]?.value;
            return (
              <View
                style={{
                  height: 24,
                  width: 36,
                  backgroundColor: colors.text,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  elevation: 3,

                  marginBottom: 30,
                }}
              >
                <Text style={{ color: colors.background, fontSize: 11, fontWeight: 'bold' }}>
                  {val}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

export default MoodChart;
