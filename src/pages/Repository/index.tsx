import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouteMatch, Link } from 'react-router-dom';

import logoImg from '../../assets/img/logo.svg';
import { Header, RepositoryInfo, Issues } from './styles';

import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface Issue {
  title: string;
  id: number;
  user: {
    login: string;
  };
  html_url: string;
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get<Repository>(`/repos/${params.repository}`).then(response => {
      setRepository(response.data);
    });

    api.get(`/repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });

    // O código abaixo é equivalente ao código acima

    // async function loadData(): Promise<void> {
    //   const [repository, issues] = await Promise.all([
    //     api.get(`/repos/${params.repository}`),
    //     api.get(`/repos/${params.repository}/issues`),
    //   ]);

    //   console.log(repository);
    //   console.log(issues);
    // }

    // loadData();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues Abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={28} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
