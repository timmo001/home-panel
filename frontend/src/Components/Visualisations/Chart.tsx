import React, { useEffect, ReactElement, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  // LabelList,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  YAxis,
} from "recharts";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}));

export const chartTypes: { [type: string]: string } = {
  area: "Area",
  bar: "Bar",
  line: "Line",
  radialBar: "Gauge",
  scatter: "Scatter",
};

export type ChartData = {
  value?: number;
  x?: number;
  y?: number;
  z?: number;
};

interface ChartProps {
  labels?: boolean;
  lowerGauge?: boolean;
  data: ChartData[];
  type?: string;
}

interface TooltipProps extends ChartProps {
  active?: boolean;
  payload?: { value: React.ReactNode }[];
  label?: string;
}

function TooltipCustom(props: TooltipProps): ReactElement | null {
  if (props.active && props.payload)
    return (
      <Typography color="textPrimary" variant="body2" component="span">
        {props.payload[0].value}
      </Typography>
    );
  return null;
}

// interface LabelProps extends ChartProps {
//   index?: number;
//   offset?: number;
//   position?: string;
//   value?: number;
//   x?: number;
//   y?: number;
// }

// function LabelCustom(props: LabelProps): ReactElement | null {
//   const theme = useTheme();

//   if (props.x && props.y && props.value)
//     return (
//       <text
//         fill={theme.palette.text.secondary}
//         x={props.x + theme.spacing(1.8)}
//         y={props.y - theme.spacing(1)}
//         textAnchor="middle"
//         dominantBaseline="middle">
//         {props.value}
//       </text>
//     );
//   return null;
// }

function Chart(props: ChartProps): ReactElement | null {
  const [dataIn, setDataIn] = useState<ChartData[]>();
  const [data, setData] = useState<ChartData[]>();
  const [type, setType] = useState<string>();

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (!type || props.type !== type) {
      setType(props.type);
      setDataIn(undefined);
      setData(undefined);
    }
  }, [type, props.type, props.data]);

  useEffect(() => {
    if (!data || dataIn !== props.data) {
      setDataIn(props.data);
      if (props.type === "radialBar")
        setData([props.data[props.data.length - 1], { value: 100 }]);
      else if (props.type === "scatter")
        setData(
          props.data.map((item: ChartData, key: number) => ({
            x: key,
            y: item.value,
            z: item.value,
          }))
        );
      else setData(props.data);
    }
  }, [props.data, props.type, data, dataIn]);

  if (!data || !type) return null;
  switch (type) {
    case "area":
      return (
        <ResponsiveContainer className={classes.root}>
          <AreaChart data={data} margin={{ top: theme.spacing(5) }}>
            <Tooltip content={<TooltipCustom {...props} />} />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.secondary.main}
                  stopOpacity={0.7}
                />
                <stop
                  offset="100%"
                  stopColor={theme.palette.secondary.dark}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="natural"
              dataKey="value"
              dot={false}
              activeDot={{
                stroke: theme.palette.secondary.main,
                strokeWidth: 2,
                r: 4,
              }}
              fillOpacity={1}
              fill="url(#colorUv)"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}>
              {/* {props.labels && (
                <LabelList
                  data={data}
                  dataKey="value"
                  content={<LabelCustom {...props} />}
                />
              )} */}
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      );
    case "bar":
      return (
        <ResponsiveContainer className={classes.root}>
          <BarChart data={data} margin={{ top: theme.spacing(6) }}>
            <Tooltip content={<TooltipCustom {...props} />} />
            <Bar dataKey="value" fill={theme.palette.secondary.main}>
              {/* {props.labels && (
                <LabelList
                  data={data}
                  dataKey="value"
                  content={<LabelCustom {...props} />}
                />
              )} */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case "line":
      return (
        <ResponsiveContainer className={classes.root}>
          <LineChart data={data} margin={{ top: theme.spacing(5) }}>
            <Tooltip content={<TooltipCustom {...props} />} />
            <Line
              type="natural"
              dataKey="value"
              dot={false}
              activeDot={{
                stroke: theme.palette.secondary.main,
                strokeWidth: 2,
                r: 4,
              }}
              stroke={theme.palette.secondary.main}
              strokeWidth={2}>
              {/* {props.labels && (
                <LabelList
                  data={data}
                  dataKey="value"
                  content={<LabelCustom {...props} />}
                />
              )} */}
            </Line>
          </LineChart>
        </ResponsiveContainer>
      );
    case "radialBar":
      return (
        <ResponsiveContainer className={classes.root}>
          <RadialBarChart
            data={data}
            cy={110}
            startAngle={180}
            endAngle={0}
            barSize={14}
            innerRadius={55}
            outerRadius={100}>
            <Tooltip content={<TooltipCustom {...props} />} />
            <RadialBar dataKey="value">
              {data.map((_entry: ChartData, key: number) => (
                <Cell
                  key={key}
                  fill={
                    key !== 0 ? "transparent" : theme.palette.secondary.main
                  }
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      );
    case "scatter":
      return (
        <ResponsiveContainer className={classes.root}>
          <ScatterChart margin={{ top: theme.spacing(5) }}>
            <YAxis hide dataKey="y" />
            <Tooltip content={<TooltipCustom {...props} />} />
            <Scatter className="scatter" data={data}>
              {/* {props.labels && (
                <LabelList
                  data={data}
                  dataKey="y"
                  content={<LabelCustom {...props} />}
                />
              )} */}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
  }
  return null;
}

export default Chart;
