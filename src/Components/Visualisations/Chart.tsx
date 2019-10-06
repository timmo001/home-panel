// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}));

export const chartTypes: { [type: string]: string } = {
  line: 'Line',
  area: 'Area',
  bar: 'Bar',
  histogram: 'Histogram',
  radialBar: 'Gauge'
};

export type ChartData = {
  value: number;
};

interface ChartProps {
  labels?: boolean;
  lowerGauge?: boolean;
  data: ChartData[];
  type?: 'line' | 'area' | 'bar' | 'histogram' | 'radialBar';
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
        x={props.x}
        y={props.y + theme.spacing(-1.5)}
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
    case 'line':
      return (
        <ResponsiveContainer className={classes.root}>
          <LineChart data={data} margin={{ top: theme.spacing(4.4) }}>
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
  }
  return null;
}

Chart.propTypes = {
  data: PropTypes.array.isRequired
};

export default Chart;
