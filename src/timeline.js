import React, { PropTypes } from 'react';
import LineCircle from './line-circle';
import { ListViewFull, ListItem } from 'eureka-rn-components';
import {
  View,
  Text
} from 'react-native';
import moment from 'moment';

function renderLeftItem ({isFirst, isLast, item, leftItem, containerStyle}) {
  if (!item || !leftItem) return null;
  return (
    <View
      style={[{
        marginTop: isFirst ? 5 : 0,
        marginBottom: isLast ? 5 : 0,
        alignSelf: isFirst ? 'flex-start' : isLast ? 'flex-end' : 'center'
      }, containerStyle]}>
      { leftItem(item) }
    </View>
  );
}

function createDiaHora({
  item,
  isFirst,
  isLast,
  lineColor,
  textColor,
  currentDayColor = 'gray',
  currentDayTextColor = 'white',
  leftItem,
  leftItemContainerStyle
}) {
  const isCurrentDay = moment(item.startDate).diff(moment(), 'days') === 0;
  const styles = {
    day: {
      fontSize: 18,
      color: isCurrentDay ? currentDayTextColor : textColor
    },
    time: {
      color: isCurrentDay ? currentDayTextColor : textColor
    },
    circleStyle: {
      backgroundColor: isCurrentDay ? currentDayColor : null
    }
  };
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {renderLeftItem({item, leftItem, isFirst, isLast, containerStyle: leftItemContainerStyle})}
      <LineCircle
        circleStyle={styles.circleStyle}
        lineColor={lineColor}
        showTopLine={!isFirst}
        showBottomLine={!isLast}>
        <Text style={styles.day}>
          { moment(item.startDate).format('DD') }
        </Text>
        <Text style={styles.time}>
          { moment(item.startDate).format('ddd') }
        </Text>
      </LineCircle>
    </View>
  );
}

function createDescription(item) {
  if (item.getDescricao && item.getDescricao === 'function') {
    return <Text>item.getDescricao()</Text>
  }
  const start = moment(item.startDate).format('HH:mm');
  const end = moment(item.endDate).format('HH:mm');
  let horario = <Text style={{fontSize: 16}}>Das {start} as {end}</Text>;
  if (!item.endDate) {
    horario = <Text style={{fontSize: 16}}>Inicia as {start}</Text>;
  }
  return (
    <View>
      { horario }
      <Text>{item.status}</Text>
    </View>
  )
}

function Timeline({itens, leftItem, leftItemContainerStyle, lineColor, currentDayColor, currentDayTextColor, titleStyle, textColor, onPress}) {
  const renderItem = (item, sectionId, rowId) => {
    const isFirst = rowId == 0;
    const isLast = rowId == itens.length - 1;
    const vAlign = !isFirst && !isLast ? 'center' : isLast ? 'flex-end' : 'flex-start';
    const leftItemElement = createDiaHora({
      item,
      isFirst,
      isLast,
      currentDayColor,
      currentDayTextColor,
      lineColor,
      textColor,
      leftItem,
      leftItemContainerStyle
    });
    return (
      <ListItem
        title={item.title}
        titleStyle={[titleStyle, {
          color: textColor,
          fontSize: 14
        }]}
        style={{paddingTop: 0}}
        onPress={() => onPress && onPress(item)}
        leftItemStyle={{width: 120}}
        rightStyle={{justifyContent: vAlign}}
        leftItem={leftItemElement}
        description={createDescription(item)}/>
    );
  }

  return (
    <ListViewFull
      { ...this.props }
      renderRow={renderItem}
      itens={itens} />
  );
}

Timeline.propTypes = {
  currentDayColor: PropTypes.string,
  currentDayTextColor: PropTypes.string,
  lineColor: PropTypes.string,
  itens: PropTypes.array.isRequired,
  titleStyle: PropTypes.any
}


export default Timeline;
