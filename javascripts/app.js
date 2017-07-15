$(function() {
  let app = new Vue({
    el: '#app',
    data: {
      ncmb: null,
      sensors: [],
      data: [],
      visible: [],
      tab: 'temperature'
    },
    created: function(){
      let me = this;
      this.ncmb = new NCMB(application_key, client_key);
      this.get_sensors()
        .then(function(sensors) {
          me.sensors = sensors;
          return me.get_sensor_data();
        })
        .then(function(data) {
          me.data = data;
        })
    },
    methods: {
      change_visible: function(sensor) {
        this.display_graph()
      },
      get_sensors: function(){
        let SensorManagement = this.ncmb.DataStore('sensor_management');
        return SensorManagement.fetchAll();
      },
      get_sensor_data: function(){
        let SensorData = this.ncmb.DataStore('sensor_data');
        return SensorData.fetchAll();
      },
      display_graph: function(e) {
        let id = e ? e.target.hash.replace('#', '') : this.tab;
        this.tab = id;
        let graph_data = [];
        for (let i = 0; i < this.data.length; i++) {
          if (this.visible.indexOf(this.data[i].sensorId) < 0) {
            continue;
          }
          let data = this.data[i][id].split(',');
          let dates = this.data[i].measureDate.split(',');
          let line_data = [];
          for (let j = 0; j < data.length; j++) {
            let date = new Date(dates[j])
            line_data.push([date, parseInt(data[j])])
          }
          graph_data.push(line_data);
        }
        let graph = Flotr.draw(document.getElementById('graph'), graph_data, {
          grid: {
            minorVerticalLines: true
          }
        });
      }
    }
  });
});