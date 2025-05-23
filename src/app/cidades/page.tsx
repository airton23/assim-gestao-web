/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { BiSolidTrashAlt, BiSolidEditAlt } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';

import S from './styles.module.scss';

import ActionsMenu from '@/components/ActionsMenu';
import Button from '@/components/Button';
import StyledLink from '@/components/Link';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';

import { getAllCidades, removeCidade } from '@/services/cidades';
import { Estado } from '@/types/api';
import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  boxShadow: 24,
  border: 'none',
  borderRadius: 4,
  p: 4,
};

export default function Cidades() {
  const [value, setValue] = React.useState(0);
  const handleClose = () => setValue(0);
  const [token, setToken] = React.useState('');
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [textResponsive, setTextResponsive] = React.useState(
    'Adicionar Nova Cidade',
  );

  React.useEffect(() => {
    const updateText = () => {
      setTextResponsive(
        window.innerWidth < 825 ? 'Adicionar' : 'Adicionar Nova Cidade',
      );
    };
    window.addEventListener('resize', updateText);
    updateText();
    return () => window.removeEventListener('resize', updateText);
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    const rolesString = localStorage.getItem('@roles');
    const roles = rolesString ? JSON.parse(rolesString) : '';
    const filter = roles.map((item: { id: number }) => item.id);
    if (!token) {
      redirect('/');
    }
    if (filter.includes(5) || filter.includes(4)) {
      redirect('/default');
    }
    setToken(token);
  }, []);

  const mutation = useMutation({
    mutationFn: ({ token, value }: { token: string; value: number }) => {
      return removeCidade(token, value);
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['cidades'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllCidades(token);
      }
      return null;
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return `Error: ${error.message}`;
  const handleOpenInfoModal = () => setInfoModalOpen(true);
  const handleCloseInfoModal = () => setInfoModalOpen(false);

  const columns: any = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: (info: any) => {
        const value: Estado = info.getValue();
        return <p>{value?.nome}</p>;
      },
    },
    {
      header: () => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Ações
          <Tooltip title="Clique aqui para informações sobre os ícones">
            <IconButton
              size="small"
              style={{ marginLeft: '5px', color: 'white' }}
              onClick={handleOpenInfoModal}
            >
              <BsInfoCircle />
            </IconButton>
          </Tooltip>
        </div>
      ),
      accessorKey: 'id',
      cell: (info: any) => {
        const value = info.getValue();

        const cidadesActions = [
          {
            icon: <BiSolidEditAlt style={{ marginRight: 8 }} />,
            text: 'Editar',
            href: `/cidades/editar/${value}`,
          },
          {
            icon: <BiSolidTrashAlt style={{ marginRight: 8, color: 'red' }} />,
            text: 'Remover',
            onClick: () => setValue(value),
            color: 'red',
          },
        ];

        return (
          <div className={S.action}>
            {window.innerWidth > 768 ? (
              <ul className={S.action} role="list">
                <li>
                  <Link href={'/cidades/editar/' + value}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="editar" size="small">
                        <BiSolidEditAlt />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </li>
                <li>
                  <Tooltip title="Remover">
                    <IconButton
                      onClick={() => setValue(value)}
                      aria-label="Deletar"
                      size="small"
                    >
                      <BiSolidTrashAlt />
                    </IconButton>
                  </Tooltip>
                </li>
              </ul>
            ) : (
              <ActionsMenu actions={cidadesActions} />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ marginTop: '5rem' }}>
      <section className={S.dashboard}>
        <div className={S.header}>
          <div className={S.headerTitle}>
            <div className={S.back}>
              <Link href="/menu" className={S.link}>
                &lt; Voltar
              </Link>
            </div>
            <div>
              <h1 className={S.title}>Cidades</h1>
            </div>
            <div className={S.addButton}>
              <StyledLink
                href="cidades/cadastrar"
                data-type="filled"
                text={textResponsive}
              />
            </div>
          </div>
        </div>
        <TableView columns={columns} data={data} />
      </section>
      <div>
        <Modal
          open={value > 0}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Tem certeza que deseja excluir?
            </Typography>
            <div className={S.buttons}>
              <Button
                type="button"
                dataType="transparent"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => mutation.mutate({ token: token, value: value })}
                style={{ backgroundColor: '#f76c6c', color: '#ffffff' }}
              >
                Excluir
              </Button>
            </div>
          </Box>
        </Modal>
        <Modal
          open={infoModalOpen}
          onClose={handleCloseInfoModal}
          aria-labelledby="info-modal-title"
          aria-describedby="info-modal-description"
        >
          <Box sx={style}>
            <Typography id="info-modal-title" variant="h6" component="h2">
              Informações dos Ícones de Ação
            </Typography>
            <Typography id="info-modal-description" sx={{ mt: 2 }}>
              <ul>
                <li>
                  <BiSolidEditAlt
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Editar:</strong> Permite modificar informações da
                  cidade.
                </li>
                <li>
                  <BiSolidTrashAlt
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Remover:</strong> Exclui a cidade após confirmação.
                </li>
              </ul>
              <br />
            </Typography>
            <Button
              onClick={handleCloseInfoModal}
              type={'button'}
              dataType="filled"
            >
              Voltar
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
