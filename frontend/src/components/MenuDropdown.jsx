import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { AppMediumText, AppRegularText, AppSemiBoldText } from '../../styles/fonts';
import Colors from '../../styles/Colors';

export default function MenuDropdown({ options, backgroundColor, selected, setSelected }) {
  const [visible, setVisible] = useState(false);
  const { width } = useWindowDimensions();

  const dropdownWidth = Math.min(width * 0.9, 280);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      style={{ width: dropdownWidth }}
      contentStyle={{
        backgroundColor,
        borderRadius: 8,
      }}
      anchor={
        <Pressable
          onPress={() => setVisible(true)}
          style={{ width: dropdownWidth }}
        >
          <View style={styles.dropdownContent}>
            <AppMediumText
              style={styles.dropdownText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {selected ? selected.optionText : 'Select an option'}
            </AppMediumText>

            <Ionicons
              name={visible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={'black'}
            />
          </View>
        </Pressable>
      }
      key={visible ? 'open' : 'closed'}
      anchorPosition="bottom"
    >
      {options.map((opt, i) => (
        <Menu.Item
          key={i}
          title={opt.optionText}
          onPress={() => {
            setSelected(opt);
            setVisible(false);
          }}
          titleStyle={styles.menuItemText}
          leadingIcon={({ size }) => (
            <Icon
              source={selected === opt ? 'check-circle' : 'circle-outline'}
              size={size}
              color={selected === opt ? Colors.primaryColor : '#999'}
            />
          )}
        />
      ))}
    </Menu>
  );
}

const styles = StyleSheet.create({
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    gap: 8,
  },

  dropdownText: {
    flex: 1,              // allows wrapping
    fontSize: 15,
    color: 'black',
  },

  menuItemText: {
    flexWrap: 'wrap',
    width: '100%',
  },
});
