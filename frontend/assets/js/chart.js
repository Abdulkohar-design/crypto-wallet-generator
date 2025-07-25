let balanceChart = null;

export function renderChart(data) {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  
  // Destroy existing chart if exists
  if (balanceChart) {
    balanceChart.destroy();
  }
  
  // Prepare chart data
  const labels = data.map(item => item.name);
  const values = data.map(item => item.balance);
  const backgroundColors = data.map(item => item.color);
  
  // Create new chart
  balanceChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#f5f6fa',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.toFixed(6)}`;
            }
          }
        }
      }
    }
  });
}