// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ApexChart from 'react-apexcharts';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    top: theme.spacing(2),
    bottom: -38,
    left: theme.spacing(-1),
    right: theme.spacing(-1)
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
  series: [
    {
      data: number[];
    }
  ];
  type?: 'line' | 'area' | 'bar' | 'histogram' | 'radialBar';
}

function Chart(props: ChartProps) {
  const [options, setOptions] = React.useState();
  const [series, setSeries] = React.useState();

  useEffect(() => {
    setSeries(
      props.type === 'radialBar'
        ? [props.series[0].data[props.series[0].data.length - 1]]
        : props.series
    );

    setOptions({
      chart: {
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [props.color || '#607D8B'],
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
          startAngle: -90,
          endAngle: 90,
          dataLabels: {
            show: false
          }
        }
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
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
  }, [props.color, props.series, props.type]);

  const classes = useStyles();

  if (!options || !series) return null;
  return (
    <div className={classes.root}>
      <ApexChart
        height="100%"
        options={options}
        series={series}
        type={props.type}
      />
    </div>
  );
}

Chart.propTypes = {
  color: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired
};

export default Chart;
