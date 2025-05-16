import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const BusinessDashboard = () => {

  const revenueData = {
    labels: ['4 Days', '3 Days', '2 Days', '1 Day', 'Today'],
    datasets: [
      {
        data: [50, 60, 70, 65, 55],
      },
    ],
  };

 
  const soldData = {
    labels: ['Product 1', 'Product 2', 'Product 3'],
    data: [0.4, 0.35, 0.25],
    colors: ['#FF6384', '#36A2EB', '#FFCE56'],
  };

  const insightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => `rgba(134, 65, 244, 1)`,
        strokeWidth: 2,
      },
      {
        data: [30, 25, 58, 40, 77, 63],
        color: () => `rgba(65, 105, 225, 1)`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello, User</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="settings-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.businessSelector}>
            <Text style={styles.businessSelectorText}>Change Business</Text>
            <Icon name="chevron-down" size={16} color="#777" />
          </View>
        </View>

        <View style={styles.businessCard}>
          <View style={styles.businessCardLeft}>
            <View style={styles.businessLogo}>
              <Icon2 name="image" size={20} color="#aaa" />
            </View>
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>Business Name</Text>
              <Text style={styles.businessSize}>Small / Medium / Big</Text>
            </View>
          </View>
          <View style={styles.businessCardRight}>
            <View style={styles.flag}>
              <Text style={styles.flagText}>USA</Text>
            </View>
            <TouchableOpacity style={styles.findButton}>
              <Text style={styles.findButtonText}>Find</Text>
            </TouchableOpacity>
          </View>
        </View>

      
        <Text style={[styles.sectionTitle, { marginVertical: 15 }]}>Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusCard, { backgroundColor: '#E8F0FF' }]}>
            <Text style={styles.statusCardTitle}>Inventory</Text>
            <View style={styles.inventoryItem}>
              <Text style={styles.productName}>Product 1</Text>
              <Text style={styles.productCount}>100</Text>
            </View>
            <View style={styles.inventoryItem}>
              <Text style={styles.productName}>Product 2</Text>
              <Text style={styles.productCount}>28</Text>
            </View>
            <View style={styles.inventoryItem}>
              <Text style={styles.productName}>Product 3</Text>
              <Text style={styles.productCount}>0</Text>
            </View>
          </View>

          <View style={[styles.statusCard, { backgroundColor: '#FFF8E8' }]}>
            <Text style={styles.statusCardTitle}>Transaction</Text>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionText}>No current transaction</Text>
            </View>
          </View>
        </View>

        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { marginVertical: 15 }]}>Analytics</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>More</Text>
            <Icon name="chevron-forward" size={16} color="#777" />
          </TouchableOpacity>
        </View>

        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>Revenue Generated</Text>
          <Text style={styles.revenueAmount}>$ 5,000,000,000.00</Text>
          
          <BarChart
            data={revenueData}
            width={screenWidth - 50}
            height={180}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(60, 120, 200, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.6,
            }}
            style={styles.chart}
            showBarTops={false}
            fromZero
          />
        </View>

        
        <View style={styles.statusRow}>
          <View style={[styles.analyticsHalfCard, { backgroundColor: '#FFF7ED' }]}>
            <Text style={styles.analyticsTitle}>Sold</Text>
            <PieChart
              data={soldData.data.map((value, index) => ({
                name: soldData.labels[index],
                population: value * 100,
                color: soldData.colors[index],
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              }))}
              width={screenWidth * 0.42}
              height={130}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
              hasLegend={false}
            />
            <Text style={styles.cardFooterText}>+5% from yesterday</Text>
          </View>

          
          <View style={[styles.analyticsHalfCard, { backgroundColor: '#F0F8FF' }]}>
            <Text style={styles.analyticsTitle}>Insight</Text>
            <LineChart
              data={insightData}
              width={screenWidth * 0.42}
              height={130}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(60, 120, 200, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',
                },
              }}
              bezier
              style={styles.chartSmall}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              withShadow={false}
              withScrollableDot={false}
            />
            <Text style={styles.cardFooterText}>+20% from yesterday</Text>
          </View>
        </View>

       
        <View style={styles.spacer} />
      </ScrollView>
      

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Business Dashboard Content</Text>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  businessSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  businessSelectorText: {
    fontSize: 12,
    marginRight: 5,
    color: '#555',
  },
  businessCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  businessCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessLogo: {
    width: 40,
    height: 40,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 12,
  },
  businessInfo: {
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
  },
  businessSize: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  businessCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  flag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 12,
    marginRight: 4,
  },
  flagIcon: {
    width: 16,
    height: 12,
  },
  findButton: {
    backgroundColor: '#F2F5FA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 5,
  },
  findButtonText: {
    fontSize: 12,
    color: '#555',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusCard: {
    width: '48%',
    borderRadius: 10,
    padding: 15,
    minHeight: 130,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  productName: {
    fontSize: 13,
  },
  productCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  transactionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 13,
    color: '#777',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 14,
    color: '#777',
    marginRight: 2,
  },
  analyticsCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  analyticsHalfCard: {
    width: '48%',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  revenueAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  chart: {
    marginTop: 10,
    borderRadius: 10,
  },
  chartSmall: {
    alignSelf: 'center',
  },
  cardFooterText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  spacer: {
    height: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#4A80F0',
  },
});

export default BusinessDashboard;