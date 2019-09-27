// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ApexChart from 'react-apexcharts';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    overflow: 'hidden',
    top: theme.spacing(1),
    bottom: -32,
    left: theme.spacing(-1.5),
    right: theme.spacing(-1.25)
  }
}));

export const chartTypes: { [type: string]: string } = {
  line: 'Line',
  area: 'Area',
  bar: 'Bar',
  histogram: 'Histogram',
  radialBar: 'Gauge'
};

interface ChartProps {
  color?: string;
  lowerGauge?: boolean;
  series: [{ data: number[] }] | number[];
  type?: 'line' | 'area' | 'bar' | 'histogram' | 'radialBar';
}

function Chart(props: ChartProps) {
  const [options, setOptions] = React.useState();
  const [series, setSeries] = React.useState();
  const [type, setType] = React.useState();

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (!type || props.type !== type) {
      setType(props.type);
      setSeries(undefined);
    }
  }, [type, props.type, props.series]);

  useEffect(() => {
    if (!series || props.series !== series) {
      setSeries(props.series);
    }
  }, [props.series, props.type, series]);

  useEffect(() => {
    if (!options || props.color !== options.colors[0]) {
      setOptions({
        chart: {
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        colors: [props.color],
        dataLabels: {
          enabled: false
        },
        grid: {
          show: false,
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        legend: {
          show: false
        },
        plotOptions: {
          radialBar: {
            size: theme.breakpoints.down('sm') ? 70 : 80,
            dataLabels: {
              show: false
            },
            offsetY: props.lowerGauge
              ? theme.breakpoints.down('sm')
                ? theme.spacing(3.7)
                : theme.spacing(4.7)
              : theme.breakpoints.down('sm')
              ? theme.spacing(2.7)
              : theme.spacing(3.7),
            startAngle: -90,
            endAngle: 90
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        tooltip: {
          enabled: false
        },
        xaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          },
          labels: {
            show: false
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          },
          labels: {
            show: false
          }
        }
      });
    }
  }, [options, props.color, props.lowerGauge, theme]);

  if (!options || !series || !type) return <div />;
  return (
    <div className={classes.root}>
      <ApexChart
        height="100%"
        width="100%"
        options={options}
        series={series}
        type={type}
      />
    </div>
  );
}

Chart.propTypes = {
  color: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired
};

export default Chart;
