// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { LineChart, Line, Tooltip } from 'recharts';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: theme.spacing(4)
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

function CustomTooltip(props: TooltipProps) {
  const theme = useTheme();

  if (props.active && props.payload)
    return (
      <Typography
        variant="body1"
        component="span"
        style={{ color: theme.palette.secondary.main }}>
        {props.payload[0].value}
      </Typography>
    );
  return null;
}

let ChartNode: HTMLDivElement | null;
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
        <div
          className={classes.root}
          ref={node => {
            ChartNode = node;
          }}>
          <LineChart
            height={
              ChartNode ? ChartNode.parentElement!.clientHeight + 42 : 100
            }
            width={ChartNode ? ChartNode.parentElement!.clientWidth + 24 : 100}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            data={data}>
            <Tooltip content={<CustomTooltip {...props} />} />
            <Line
              type="natural"
              dataKey="value"
              dot={false}
              activeDot={{
                stroke: theme.palette.secondary.main,
                strokeWidth: 2,
                r: 4
              }}
              stroke={theme.palette.secondary.main}
            />
          </LineChart>
        </div>
      );
  }
  return null;
}

Chart.propTypes = {
  data: PropTypes.array.isRequired
};

export default Chart;
