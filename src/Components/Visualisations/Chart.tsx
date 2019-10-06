// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  LabelList,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}));

export const chartTypes: { [type: string]: string } = {
  area: 'Area',
  line: 'Line',
  bar: 'Bar',
  radialBar: 'Gauge'
};

export type ChartData = {
  value: number;
};

interface ChartProps {
  labels?: boolean;
  lowerGauge?: boolean;
  data: ChartData[];
  type?: string;
}

interface TooltipProps extends ChartProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function TooltipCustom(props: TooltipProps) {
  if (props.active && props.payload)
    return (
      <Typography color="textPrimary" variant="body2" component="span">
        {props.payload[0].value}
      </Typography>
    );
  return null;
}

interface LabelProps extends ChartProps {
  index?: number;
  offset?: number;
  position?: string;
  value?: number;
  x?: number;
  y?: number;
}

function LabelCustom(props: LabelProps) {
  const theme = useTheme();

  if (props.x && props.y && props.value)
    return (
      <text
        fill={theme.palette.text.secondary}
        x={props.x + theme.spacing(1.8)}
        y={props.y - theme.spacing(1)}
        textAnchor="middle"
        dominantBaseline="middle">
        {props.value}
      </text>
    );
  return null;
}

function Chart(props: ChartProps) {
  const [data, setData] = React.useState();
  const [type, setType] = React.useState();

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (!type || props.type !== type) {
      setType(props.type);
      setData(undefined);
    }
  }, [type, props.type, props.data]);

  useEffect(() => {
    if (!data || props.data !== data) {
      setData(props.data);
    }
  }, [props.data, props.type, data]);

  if (!data || !type) return null;
  switch (type) {
    case 'area':
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
                r: 4
              }}
              fillOpacity={1}
              fill="url(#colorUv)"
              stroke={theme.palette.secondary.main}>
              {props.labels && (
                <LabelList
                  dataKey="value"
                  content={<LabelCustom {...props} />}
                />
              )}
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'line':
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
                r: 4
              }}
              stroke={theme.palette.secondary.main}>
              {props.labels && (
                <LabelList
                  dataKey="value"
                  content={<LabelCustom {...props} />}
                />
              )}
            </Line>
          </LineChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer className={classes.root}>
          <BarChart data={data} margin={{ top: theme.spacing(6) }}>
            <Tooltip content={<TooltipCustom {...props} />} />
            <Bar dataKey="value" fill={theme.palette.secondary.main}>
              {props.labels && (
                <LabelList
                  dataKey="value"
                  content={<LabelCustom {...props} />}
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case 'radialBar':
      return (
        <ResponsiveContainer className={classes.root}>
          <RadialBarChart
            data={[data[data.length - 1]]}
            cy={110}
            startAngle={180}
            endAngle={0}
            barSize={15}
            innerRadius={60}
            outerRadius={100}>
            <Tooltip content={<TooltipCustom {...props} />} />
            <RadialBar dataKey="value" fill={theme.palette.secondary.main} />
          </RadialBarChart>
        </ResponsiveContainer>
      );
  }
  return null;
}

Chart.propTypes = {
  data: PropTypes.array.isRequired
};

export default Chart;
