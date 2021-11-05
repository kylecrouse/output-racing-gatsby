import * as React from "react"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as styles from './tabs.module.css';

const TabWrapper = (props) => {
	return (
		<Tabs className={ styles.container }>
			<TabList className={ styles.list }>
				{ props.tabs.map(({ title }) => (
						<Tab className={ styles.tab }><span>{ title }</span></Tab>	
					))
				}
			</TabList>      
			
			{ props.tabs.map(({ content }) => (
					<TabPanel className={ styles.panel }>
						{ content }
					</TabPanel>
				))
			}
		</Tabs>		
	)
}

export default TabWrapper