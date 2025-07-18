import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'

import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import permissions from '@/configs/permissions'

const roleService = () => {
    const axios = useAxiosIns()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return {}
}

export default roleService
