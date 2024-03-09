import { useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/router'

const SaveWarning = (props) => {
  const { unsavedChanges = false } = props
  const router = useRouter()
  const warningText = 'You have unsaved changes - are you sure you wish to leave this page?'

  useEffect(() => {
    const handleWindowClose = (e) => {
      if (!unsavedChanges) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }
    const handleBrowseAway = () => {
      if (!unsavedChanges) return
      if (window.confirm(warningText)) return
      router.events.emit('routeChangeError')
      throw 'routeChange aborted.'
    }
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [unsavedChanges])

}
export default SaveWarning