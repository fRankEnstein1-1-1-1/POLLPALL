import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown, ChevronUp, Award, TrendingUp } from 'lucide-react-native';
import Card from './Card';
export default function ElectionVotesCard({ votes }) {
  const [expanded, setExpanded] = useState(true);
  const [rotateAnimation] = useState(new Animated.Value(1));

  const toggleExpanded = () => {
    Animated.timing(rotateAnimation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  if (!votes.length) return null;

  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpanded}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Award size={20} color="#6A5ACD" style={styles.headerIcon} />
          <Text style={styles.title}>Current Election</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          {expanded ? 
            <ChevronUp size={20} color="#6A5ACD" /> : 
            <ChevronDown size={20} color="#6A5ACD" />
          }
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {votes.map((vote, index) => (
            <View 
              key={index} 
              style={[
                styles.voteItem,
                index < votes.length - 1 && styles.itemBorder
              ]}
            >
              <View style={styles.positionContainer}>
                <Text style={styles.positionName}>{vote.position}</Text>
                <View style={styles.rankContainer}>
                  <TrendingUp size={14} color="#6A5ACD" />
                  <Text style={styles.rankText}>Rank #{vote.rank}</Text>
                </View>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.voteStats}>
                  <Text style={styles.voteCount}>{vote.votes}</Text>
                  <Text style={styles.voteLabel}>votes</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${(vote.votes / vote.totalVotes) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.percentageText}>
                  {((vote.votes / vote.totalVotes) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    color: '#6A5ACD',
  },
  content: {
    paddingHorizontal: 16,
  },
  voteItem: {
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  positionName: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 15,
    color: '#1F2937',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontFamily: 'System',
    fontSize: 12,
    color: '#6A5ACD',
    marginLeft: 4,
  },
  statsContainer: {
    marginTop: 4,
  },
  voteStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  voteCount: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 18,
    color: '#6A5ACD',
    marginRight: 4,
  },
  voteLabel: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: 14,
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6A5ACD',
    borderRadius: 3,
  },
  percentageText: {
    fontFamily: 'System',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
});