import React from 'react'
import AuxSectionTwo from '../../../components/aux-section-two/AuxSectionTwo'
import AuxSectionOne from '../../../components/aux-section-one/AuxSectionOne'
import EntriesSection from '../../../components/entries-section/EntriesSection'
import "./PracticePage.css"
import useScreenSize from '../../../hooks/useScreenSize'
import EntryMobile from '../../../components/entries-section/entry-mobile/EntryMobile'

const PracticePage = () => {

  if (useScreenSize().width < 600) {
    return (
      <EntryMobile />
    )
  }

  return (
    <div className='modes_page_container practice_color'>
      <h1 className='head_task'>Modo Tarea</h1>
      <EntriesSection />
      <AuxSectionOne />
      <AuxSectionTwo />
    </div>
  )
}

export default PracticePage
